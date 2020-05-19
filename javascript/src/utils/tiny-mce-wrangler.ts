import * as tinymce from "tinymce";
import he from "he";
import { ApiService } from "./api-service";
import { ElementMetadata } from "./element-metadata";
import { SsFreedomAdminWidget } from "../components/ss-freedom-admin-widget/ss-freedom-admin-widget";

declare global {
  interface Window {
    tinymce: {
      editors: tinymce.Editor[];
    };
  }
}

export class TinyMceWrangler {
  private tinyMce: Promise<any>;
  private observer: MutationObserver;
  private htmlElement: Element;
  private apiService: ApiService;

  private static getTinyMceConfigurations() {
    return window["NikRolls"].SsFreedom.configurations;
  }

  constructor(
    _MutationObserver = MutationObserver,
    htmlElement = document.documentElement,
    apiService: ApiService = null
  ) {
    this.observer = new _MutationObserver((changes: MutationRecord[]) =>
      this.observerCallback(changes)
    );
    this.htmlElement = htmlElement;
    this.apiService = apiService || new ApiService();
    this.getTinyMce();
  }

  observeDom() {
    this.observer.observe(this.htmlElement, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    Array.from(
      this.htmlElement.querySelectorAll("[data-ss-freedom-field]")
    ).forEach((element: HTMLElement) =>
      this.initialiseEditorIfNecessary(element)
    );
  }

  private observerCallback(changes: MutationRecord[]) {
    changes.forEach(async (change) => {
      if (
        change.type === "attributes" &&
        change.attributeName === "data-ss-freedom-field"
      ) {
        this.initialiseEditorIfNecessary(<HTMLElement>change.target);
      } else if (change.type === "childList") {
        Array.from(change.addedNodes).forEach((node) => {
          if (node instanceof HTMLElement) {
            const fieldNodes = Array.from(
              node.querySelectorAll("[data-ss-freedom-field]")
            );
            if (node.dataset && node.dataset.ssFreedomField) {
              fieldNodes.push(node);
            }
            fieldNodes.forEach((object) =>
              this.initialiseEditorIfNecessary(object as HTMLElement)
            );
          }
        });
      }
      (await this.tinyMce).editors.forEach((editor: tinymce.Editor) => {
        if (editor.getBody() && !document.body.contains(editor.getBody())) {
          editor.destroy();
        }
      });
    });
  }

  async initialiseEditorIfNecessary(element: HTMLElement) {
    if (element.dataset.ssFreedomField) {
      const existingEditor = (await this.tinyMce).editors.find(
        (e: tinymce.Editor) => e.getBody() === element
      );
      if (!existingEditor) {
        const metadata = ElementMetadata.getElementConfiguration(element);
        const configurations = TinyMceWrangler.getTinyMceConfigurations();
        if (configurations[metadata.type]) {
          await this.initialiseTinyMceConfiguration(metadata.type, element);
        }
      }
    }
  }

  private async initialiseTinyMceConfiguration(name, element) {
    const configurations = TinyMceWrangler.getTinyMceConfigurations();
    const setups = [];
    const globalConfig = this.extendConfiguration(
      {},
      configurations["all"],
      configurations
    );
    let config = this.extendConfiguration(
      globalConfig,
      configurations[name],
      configurations
    );
    config = Object.assign(config, {
      target: element,
      setup: (editor: tinymce.Editor) => setups.forEach((fn) => fn(editor)),
      init_instance_callback: (editor: tinymce.Editor) => {
        editor.on("Change", (e) => this.onChange(e));
        editor.on("blur", (e) => this.onBlur(e));
        TinyMceWrangler.updateEmptyFlag(editor);
      },
      link_list: (callback) => this.apiService.getLinkList().then(callback),
      urlconverter_callback: (url) => {
        if (url.startsWith("[sitetree_link%20id=")) {
          return decodeURI(url);
        } else {
          return url;
        }
      },
    });

    if (Array.isArray(config.valid_elements)) {
      config.valid_elements = config.valid_elements.join(",");
    }

    if (Array.isArray(config.extended_valid_elements)) {
      config.extended_valid_elements = config.extended_valid_elements.join(",");
    }

    if (Array.isArray(config.toolbar)) {
      config.toolbar = config.toolbar.join(" ");
    }

    if (config.element_options) {
      const elementOptions = config.element_options;
      delete config.element_options;
      setups.push((editor: tinymce.Editor) =>
        this.createTinyMceOptionsMenu(editor, elementOptions)
      );
    }

    if (element instanceof HTMLButtonElement) {
      setups.push((editor: tinymce.Editor) => {
        element.addEventListener("click", (e) => e.preventDefault());
        element.addEventListener("keydown", (e: KeyboardEvent) => {
          if (e.code === "Space") {
            e.preventDefault();
            editor.insertContent(" ");
          }
        });
      });
    }

    setups.push((editor: tinymce.Editor) => {
      editor.on("PostProcess", function (e) {
        e.content = e.content.replace(
          /<ss-freedom-shortcode[^>]*?tag='([^']*?)'[^>]*?>.*?<\/ss-freedom-shortcode>/g,
          (_, capture) => he.decode(capture)
        );
      });
    });

    return (await this.tinyMce).init(config);
  }

  extendConfiguration(base, extension, configurations) {
    base = Object.assign({}, base);
    if (extension["extends"]) {
      const extended = configurations[extension["extends"]];
      base = this.extendConfiguration(base, extended, configurations);
    }

    return Object.keys(extension).reduce((output, key) => {
      if (Array.isArray(output[key])) {
        const existingPosition = extension[key].indexOf(">> existing");
        output[key] = [].concat(
          extension[key].slice(0, Math.max(0, existingPosition)),
          output[key],
          extension[key].slice(existingPosition + 1)
        );
      } else if (typeof output[key] === "object") {
        output[key] = this.extendConfiguration(
          output[key],
          extension[key],
          null
        );
      } else {
        output[key] = extension[key];
      }
      return output;
    }, base);
  }

  getTinyMce() {
    this.tinyMce = new Promise((resolve) => {
      const waitForTinyMce = window.setInterval(() => {
        if (window.tinymce) {
          window.clearInterval(waitForTinyMce);
          resolve(window.tinymce);
        }
      });
    });
  }

  protected async onChange(e) {
    TinyMceWrangler.updateEmptyFlag(e.target);
    await this.updateCmsWithLatestData(e.target);
  }

  protected async onBlur(e) {
    const currentObject = ElementMetadata.getObjectForFieldElement(
      e.target.getBody()
    );
    if (currentObject["latestFieldUpdate"]) {
      const newHTML = await currentObject["latestFieldUpdate"];
      const focusedEditor = (await this.tinyMce).focusedEditor;
      const newObject =
        focusedEditor &&
        ElementMetadata.getObjectForFieldElement(focusedEditor.getBody());
      if (newObject !== currentObject) {
        currentObject.outerHTML = newHTML;
      }
    }
  }

  private createTinyMceOptionsMenu(editor, configurations) {
    editor.ui.registry.addMenuButton("elementoptions", {
      text: "Options",
      fetch: (callback) => {
        const items = configurations.reduce((menus, configuration) => {
          const currentNode = editor.selection.getNode();
          const closestMatch = currentNode.closest(configuration.selector);
          const closestMatchIsWithinEditor = editor
            .getBody()
            .contains(closestMatch);
          if (closestMatch && closestMatchIsWithinEditor) {
            menus.push({
              type: "nestedmenuitem",
              text: configuration.name,
              getSubmenuItems: () => {
                const options = configuration.options;
                const keys = Object.keys(options);
                const values = Object.values(options).filter(
                  (value) => !!value
                );
                const defaultItem = keys.find((name) => options[name] === null);
                const selectedItem =
                  keys.find((name) => {
                    const rule = options[name];
                    return (
                      rule &&
                      Object.keys(rule).every((attr) => {
                        const attrValue = closestMatch.getAttribute(attr);
                        return (
                          attrValue &&
                          TinyMceWrangler.tokeniseAttribute(
                            closestMatch,
                            attr
                          ).indexOf(rule[attr]) >= 0
                        );
                      })
                    );
                  }) || defaultItem;

                return keys.map((name) => ({
                  type: "menuitem",
                  text: name,
                  icon: name === selectedItem ? "checkmark" : undefined,
                  onAction: () => {
                    values.forEach((inactiveRule) => {
                      inactiveRule &&
                        Object.keys(inactiveRule).forEach((attr) => {
                          const values = TinyMceWrangler.tokeniseAttribute(
                            closestMatch,
                            attr
                          );
                          const currentRulePosition = values.indexOf(
                            inactiveRule[attr]
                          );
                          if (currentRulePosition >= 0) {
                            values.splice(currentRulePosition, 1);
                            closestMatch.setAttribute(attr, values.join(" "));
                          }
                        });
                    });

                    const newRule = options[name];
                    newRule &&
                      Object.keys(newRule).forEach((attr) => {
                        const values = TinyMceWrangler.tokeniseAttribute(
                          closestMatch,
                          attr
                        );
                        values.push(newRule[attr]);
                        TinyMceWrangler.setTokenisedAttribute(
                          closestMatch,
                          attr,
                          values
                        );
                      });
                  },
                }));
              },
            });
          }
          return menus;
        }, []);
        callback(items);
      },
    });
  }

  private static tokeniseAttribute(
    element: HTMLElement,
    name: string
  ): string[] {
    const currentValue = element.getAttribute(name) || "";
    return currentValue.split(" ").filter((value) => value);
  }

  private static setTokenisedAttribute(
    element: HTMLElement,
    name: string,
    values: string[]
  ): HTMLElement {
    element.setAttribute(name, values.join(" ").trim());
    return element;
  }

  private static updateEmptyFlag(editor: tinymce.Editor) {
    const element = editor.getBody();
    if (editor.getContent().trim()) {
      element.classList.remove("ss-freedom-empty");
    } else {
      element.classList.add("ss-freedom-empty");
    }
  }

  private async updateCmsWithLatestData(editor: tinymce.Editor) {
    const editorBody = editor.getBody();
    const objectElement = ElementMetadata.getObjectForFieldElement(editorBody);
    const object = ElementMetadata.getObjectDataForFieldElement(editorBody);

    const data = {};
    data[
      ElementMetadata.getElementConfiguration(editorBody).name
    ] = editor.getContent();

    objectElement["latestFieldUpdate"] = this.apiService.updateObject(
      object.class,
      object.id,
      data
    );
    await objectElement["latestFieldUpdate"];
    SsFreedomAdminWidget.RefreshPublishedStatus();

    return await objectElement["latestFieldUpdate"];
  }
}

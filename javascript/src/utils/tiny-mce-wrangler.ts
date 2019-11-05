import * as tinymce from 'tinymce';
import he from 'he';
import {ApiService} from './api-service';
import {ElementMetadata} from './element-metadata';

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
    return window['NikRolls'].SsFreedom.configurations;
  }

  constructor(
    _MutationObserver = MutationObserver,
    htmlElement = document.documentElement,
    apiService: ApiService = null,
  ) {
    this.observer = new _MutationObserver((changes: MutationRecord[]) => this.observerCallback(changes));
    this.htmlElement = htmlElement;
    this.apiService = apiService || new ApiService();
    this.getTinyMce();
  }

  observeDom() {
    this.observer.observe(this.htmlElement, {attributes: true, childList: true, subtree: true});
    Array.from(this.htmlElement.querySelectorAll('[data-ss-freedom-field]'))
      .forEach((element: HTMLElement) => this.initialiseEditorIfNecessary(element));
  }

  private observerCallback(changes: MutationRecord[]) {
    changes.forEach(async (change) => {
      if (change.type === 'attributes' && change.attributeName === 'data-ss-freedom-field') {
        this.initialiseEditorIfNecessary(<HTMLElement>change.target);
      } else if (change.type === 'childList') {
        Array.from(change.addedNodes).forEach((node) => {
          if (node instanceof HTMLElement) {
            const fieldNodes = Array.from(node.querySelectorAll('[data-ss-freedom-field]'));
            if (node.dataset && node.dataset.ssFreedomField) {
              fieldNodes.push(node);
            }
            fieldNodes.forEach(object => this.initialiseEditorIfNecessary(object as HTMLElement));
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
      const existingEditor = (await this.tinyMce).editors.find((e: tinymce.Editor) => e.getBody() === element);
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
    const config = Object.assign(
      {},
      configurations['all'],
      configurations[name],
      {
        target: element,
        setup: (editor: tinymce.Editor) => setups.forEach(fn => fn(editor)),
        init_instance_callback: (editor: tinymce.Editor) => {
          editor.on('Change', e => this.onChange(e));
          TinyMceWrangler.updateEmptyFlag(editor);
        },
        link_list: callback => this.apiService.getLinkList().then(callback),
        urlconverter_callback: (url) => {
          if (url.startsWith('[sitetree_link%20id=')) {
            return decodeURI(url);
          } else {
            return url;
          }
        }
      }
    );

    if (config.element_options) {
      const elementOptions = config.element_options;
      delete config.element_options;
      setups.push((editor: tinymce.Editor) => this.createTinyMceOptionsMenu(editor, elementOptions));
    }

    if (element instanceof HTMLButtonElement) {
      setups.push((editor: tinymce.Editor) => {
        element.addEventListener('click', e => e.preventDefault());
        element.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.code === 'Space') {
            e.preventDefault();
            editor.insertContent(' ');
          }
        });
      });
    }

    setups.push((editor: tinymce.Editor) => {
      editor.on('PostProcess', function (e) {
        e.content = e.content.replace(
          /<ss-freedom-shortcode[^>]*?tag="([^"]*?)"[^>]*?>.*?<\/ss-freedom-shortcode>/g,
          (_, capture) => he.decode(capture)
        );
      });
    });

    return (await this.tinyMce).init(config);
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

  private createTinyMceOptionsMenu(editor, configurations) {
    editor.ui.registry.addMenuButton('elementoptions', {
      text: 'Options',
      fetch: (callback) => {
        const items = configurations.reduce((menus, configuration) => {
          const currentNode = editor.selection.getNode();
          const closestMatch = currentNode.closest(configuration.selector);
          const closestMatchIsWithinEditor = editor.getBody().contains(closestMatch);
          if (closestMatch && closestMatchIsWithinEditor) {
            menus.push({
              type: 'nestedmenuitem',
              text: configuration.name,
              getSubmenuItems: () => {
                const options = configuration.options;
                const keys = Object.keys(options);
                const values = Object.values(options).filter(value => !!value);
                const defaultItem = keys.find(name => options[name] === null);
                const selectedItem = keys.find((name) => {
                  const rule = options[name];
                  return rule && Object.keys(rule).every((attr) => {
                    const attrValue = closestMatch.getAttribute(attr);
                    return attrValue && TinyMceWrangler.tokeniseAttribute(closestMatch, attr).indexOf(rule[attr]) >= 0;
                  });
                }) || defaultItem;

                return keys.map((name) => ({
                  type: 'menuitem',
                  text: name,
                  icon: name === selectedItem ? 'checkmark' : undefined,
                  onAction: () => {
                    values.forEach((inactiveRule) => {
                      inactiveRule && Object.keys(inactiveRule).forEach((attr) => {
                        const values = TinyMceWrangler.tokeniseAttribute(closestMatch, (attr));
                        const currentRulePosition = values.indexOf(inactiveRule[attr]);
                        if (currentRulePosition >= 0) {
                          values.splice(currentRulePosition, 1);
                          closestMatch.setAttribute(attr, values.join(' '));
                        }
                      });
                    });

                    const newRule = options[name];
                    newRule && Object.keys(newRule).forEach((attr) => {
                      const values = TinyMceWrangler.tokeniseAttribute(closestMatch, (attr));
                      values.push(newRule[attr]);
                      TinyMceWrangler.setTokenisedAttribute(closestMatch, attr, values);
                    });
                  }
                }));
              }
            });
          }
          return menus;
        }, []);
        callback(items);
      }
    });
  }

  private static tokeniseAttribute(element: HTMLElement, name: string): string[] {
    const currentValue = element.getAttribute(name) || '';
    return currentValue.split(' ').filter(value => value);
  }

  private static setTokenisedAttribute(element: HTMLElement, name: string, values: string[]): HTMLElement {
    element.setAttribute(name, values.join(' ').trim());
    return element;
  }

  private static updateEmptyFlag(editor: tinymce.Editor) {
    const element = editor.getBody();
    if (editor.getContent().trim()) {
      element.classList.remove('ss-freedom-empty');
    } else {
      element.classList.add('ss-freedom-empty');
    }
  }

  private async updateCmsWithLatestData(editor: tinymce.Editor) {
    const object = ElementMetadata.getObjectDataForFieldElement(editor.getBody());
    const data = {};
    data[ElementMetadata.getElementConfiguration(editor.getBody()).name] = editor.getContent();
    return await this.apiService.updateObject(object.class, object.id, data);
  }
}

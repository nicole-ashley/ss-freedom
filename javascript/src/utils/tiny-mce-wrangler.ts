import * as tinymce from 'tinymce';
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
        }
      }
    );

    if (config.class_selection_options) {
      const classSelectionOptions = config.class_selection_options;
      delete config.class_selection_options;
      setups.push((editor: tinymce.Editor) => this.createTinyMceOptionsMenu(editor, classSelectionOptions));
    }

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

  private createTinyMceOptionsMenu(editor, classSelectionOptions) {
    editor.ui.registry.addMenuButton('classselectionoptions', {
      text: 'Options',
      fetch: (callback) => {
        const items = classSelectionOptions.reduce((menus, option) => {
          const currentNode = editor.selection.getNode();
          const closestMatch = currentNode.closest(option.selector);
          const closestMatchIsWithinEditor = editor.getBody().contains(closestMatch);
          if (closestMatch && closestMatchIsWithinEditor) {
            menus.push({
              type: 'nestedmenuitem',
              text: option.name,
              getSubmenuItems: () => {
                const classes = option.classes;
                const keys = Object.keys(classes);
                const values = Object.values(classes).filter(value => !!value);
                const defaultItem = keys.find(name => classes[name] === null);
                const selectedItem = keys.find(name => closestMatch.classList.contains(classes[name])) || defaultItem;

                return keys.map((name) => ({
                  type: 'menuitem',
                  text: name,
                  icon: name === selectedItem ? 'checkmark' : undefined,
                  onAction: () => {
                    closestMatch.classList.remove(...values);
                    if (classes[name]) {
                      closestMatch.classList.add(classes[name]);
                    }
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

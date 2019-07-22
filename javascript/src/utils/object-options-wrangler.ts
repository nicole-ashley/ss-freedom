import {ObjectOptionsInstanceWrangler} from './object-options-instance-wrangler';

export class ObjectOptionsWrangler {
  private observer: MutationObserver;
  private htmlElement: Element;

  constructor(
    _MutationObserver = MutationObserver,
    htmlElement = document.documentElement
  ) {
    this.observer = new _MutationObserver((changes: MutationRecord[]) => this.observerCallback(changes));
    this.htmlElement = htmlElement;
  }

  observeDom() {
    this.observer.observe(this.htmlElement, {attributes: true, childList: true, subtree: true});
    Array.from(this.htmlElement.querySelectorAll('[data-ss-freedom-object]'))
      .forEach((element: HTMLElement) => this.wireObjectOptionsIfNecessary(element));
  }

  private observerCallback(changes: MutationRecord[]) {
    changes.forEach((change) => {
      if (change.type === 'attributes' && change.attributeName === 'data-ss-freedom-object') {
        this.wireObjectOptionsIfNecessary(<HTMLElement>change.target);
      } else if (change.type === 'childList') {
        Array.from(change.addedNodes).forEach((node) => {
          if (node instanceof HTMLElement) {
            const objectNodes = Array.from(node.querySelectorAll('[data-ss-freedom-object]'));
            if (node.dataset && node.dataset.ssFreedomObject) {
              objectNodes.push(node);
            }
            objectNodes.forEach(object => this.wireObjectOptionsIfNecessary(object as HTMLElement));
          }
        });
      }
    });
  }

  private wireObjectOptionsIfNecessary(element: HTMLElement) {
    const data = JSON.parse(element.dataset.ssFreedomObject);
    if (data.hasOptions && !element['ssFreedomObjectOptionsInstanceWrangler']) {
      element['ssFreedomObjectOptionsInstanceWrangler'] = new ObjectOptionsInstanceWrangler(element);
    } else if (!data.hasOptions && element['ssFreedomObjectOptionsInstanceWrangler']) {
      element['ssFreedomObjectOptionsInstanceWrangler'].destroy();
      delete element['ssFreedomObjectOptionsInstanceWrangler'];
    }
  }
}

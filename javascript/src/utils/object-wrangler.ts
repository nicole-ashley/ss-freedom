import {ObjectInstanceWrangler} from './object-instance-wrangler';

export class ObjectWrangler {
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
    Array.from(this.htmlElement.querySelectorAll('[ss-freedom-object]'))
      .forEach((element: HTMLElement) => this.wireObjectOptionsIfNecessary(element));
  }

  private observerCallback(changes: MutationRecord[]) {
    changes.forEach((change) => {
      if (change.type === 'attributes' && change.attributeName === 'ss-freedom-object') {
        this.wireObjectOptionsIfNecessary(<HTMLElement>change.target);
      } else if (change.type === 'childList') {
        Array.from(change.addedNodes).forEach((node) => {
          if (node instanceof HTMLElement) {
            const objectNodes = Array.from(node.querySelectorAll('[ss-freedom-object]'));
            if (node.hasAttribute('ss-freedom-object')) {
              objectNodes.push(node);
            }
            objectNodes.forEach(object => this.wireObjectOptionsIfNecessary(object as HTMLElement));
          }
        });
        Array.from(change.removedNodes).forEach((node) => {
          if (node instanceof HTMLElement) {
            const objectNodes = Array.from(node.querySelectorAll('[ss-freedom-object]'));
            if (node.hasAttribute('ss-freedom-object')) {
              objectNodes.push(node);
            }
            objectNodes.forEach(object => this.unwireObjectOptionsIfPresent(object as HTMLElement));
          }
        });
      }
    });
  }

  private wireObjectOptionsIfNecessary(element: HTMLElement) {
    if (!element['ssFreedomObjectInstanceWrangler']) {
      element['ssFreedomObjectInstanceWrangler'] = new ObjectInstanceWrangler(element);
    } 
  }

  private unwireObjectOptionsIfPresent(element: HTMLElement) {
    if (element['ssFreedomObjectInstanceWrangler']) {
      element['ssFreedomObjectInstanceWrangler'].destroy();
      delete element['ssFreedomObjectInstanceWrangler'];
    }
  }
}

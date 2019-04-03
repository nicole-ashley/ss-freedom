import {TextField} from './text-field';
import {HtmlField} from './html-field';

export class DomObserver {
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
    Array.from(this.htmlElement.querySelectorAll('[data-ss-freedom-field]'))
      .forEach((element: HTMLElement) => this.wireFieldElement(element));
  }

  private observerCallback(changes: MutationRecord[]) {
    changes.forEach((change) => {
      if (change.attributeName === 'data-ss-freedom-field') {
        this.wireFieldElement(<HTMLElement>change.target);
      }
    });
  }

  private wireFieldElement(element: HTMLElement) {
    if (!element['ssFreedomController']) {
      const configuration = JSON.parse(element.dataset.ssFreedomField);
      switch (configuration.type) {
        case 'text':
          element['ssFreedomController'] = new TextField(element);
          break;
        case 'html':
          element['ssFreedomController'] = new HtmlField(element);
          break;
      }
    }
  }
}

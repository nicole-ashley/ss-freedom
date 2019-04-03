import {Field} from './field';

export class HtmlField extends Field {
  private document: Document;

  constructor(element: HTMLElement, _document: Document = document) {
    super(element);
    this.document = _document;
    this.init();
  }

  get value(): string {
    return this.element.innerHTML;
  }

  init() {
    this.element.contentEditable = 'true';
    this.element.addEventListener('focus', () => {
      this.document.execCommand('defaultParagraphSeparator', false, 'p');
    });
    this.element.addEventListener('keydown', () => {
      this.onChanged();
    });
  }
}

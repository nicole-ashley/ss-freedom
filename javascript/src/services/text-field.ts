import {Field} from './field';

export class TextField extends Field {

  constructor(element: HTMLElement) {
    super(element);
    this.init();
  }

  get value(): string {
    return this.element.innerText;
  }

  init() {
    this.element.contentEditable = 'true';
    this.element.addEventListener('keydown', (event: KeyboardEvent) => {
      const formatting = (event.ctrlKey || event.metaKey) && 'biu'.indexOf(event.key) >= 0;
      const enter = event.key === 'Enter';

      if (formatting || enter) {
        event.preventDefault();
      } else {
        this.onChanged();
      }
    });
  }
}

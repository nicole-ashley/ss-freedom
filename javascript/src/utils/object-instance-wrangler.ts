import { ElementMetadata } from './element-metadata';

export class ObjectInstanceWrangler {
  private element: HTMLElement;
  private optionsButton: HTMLElement;
  private alertButton: HTMLElement;
  private hoverState = false;

  constructor(element: HTMLElement) {
    this.element = element;
    this.handleUpdate = this.handleUpdate.bind(this);
    this.setup();
  }

  public setup() {
    this.element.addEventListener('mouseover', this.handleUpdate);
    this.handleUpdate();
  }

  public destroy() {
    this.element.removeEventListener('mouseover', this.handleUpdate);
    this.removeHoverState();
  }

  private handleUpdate(e: MouseEvent = null) {
    if (e) {
      e.stopPropagation();
    }

    const metadata = ElementMetadata.getObjectData(this.element);
    const monitoredElements: Element[] = [
      this.element,
      this.optionsButton,
      this.alertButton,
      ...Array.from(
        document.querySelectorAll(`ss-freedom-object-options-panel[ss-freedom-uid="${metadata.uid}"]`)
      )
    ];

    const activeEditor = window.tinymce.activeEditor;
    const activeField = activeEditor && activeEditor.getBody();
    if (activeField && activeField.closest(`[ss-freedom-object="${metadata.uid}"]`) === this.element) {
      monitoredElements.push(activeEditor.getContainer());
    }

    const hoveredElements = monitoredElements.filter(element => element && element.matches(':hover'));
    hoveredElements.forEach((element) => {
      element.removeEventListener('mouseleave', this.handleUpdate);
      element.addEventListener('mouseleave', this.handleUpdate, { once: true })
    });
    
    const newHoverState = hoveredElements.length > 0;
    if (newHoverState) {
      this.ensureButtonsPresent();
      if (newHoverState != this.hoverState) {
        this.showEmptyFields();
      }
    } else {
      this.ensureButtonsNotPresent();
      if (newHoverState != this.hoverState) {
        this.removeHoverState();
      }
    }
    this.hoverState = newHoverState;
  }

  private ensureButtonsPresent() {
    const metadata = ElementMetadata.getObjectData(this.element);

    if (document.querySelector(`ss-freedom-object-options-panel[ss-freedom-uid="${metadata.uid}"]`)) {
      return;
    }
    
    if (metadata.hasOptions && !(this.optionsButton && this.optionsButton.parentElement)) {
      this.optionsButton = document.createElement('ss-freedom-object-options-button');
      this.optionsButton['element'] = this.element;
      this.optionsButton.setAttribute('ss-freedom-uid', metadata.uid);
      document.body.prepend(this.optionsButton);
    }

    if (metadata.alerts && !(this.alertButton && this.alertButton.parentElement)) {
      this.alertButton = document.createElement('ss-freedom-object-alert-button');
      this.alertButton['element'] = this.element;
      this.alertButton.setAttribute('ss-freedom-uid', metadata.uid);
      document.body.prepend(this.alertButton);
    }
  }

  private ensureButtonsNotPresent() {
    const metadata = ElementMetadata.getObjectData(this.element);

    const buttons = document.querySelectorAll([
      `ss-freedom-object-options-button[ss-freedom-uid="${metadata.uid}"]`,
      `ss-freedom-object-alert-button[ss-freedom-uid="${metadata.uid}"]`
    ].join(','));
    buttons.forEach(element => element.remove());

    this.optionsButton = null;
    this.alertButton = null;
  }

  private showEmptyFields() {
    const ancestry = [this.element];
    let closest = this.element;
    do {
      closest = closest.parentElement.closest('[ss-freedom-object]');
      if (closest) {
        ancestry.unshift(closest);
      }
    } while (closest);
    
    document.querySelectorAll('.ss-freedom-show-hidden-empty')
      .forEach(e => e.classList.remove('ss-freedom-show-hidden-empty'));
    ancestry.forEach((element) => {
      element.querySelectorAll('[ss-freedom-hidden-when-empty]')
        .forEach(e => e.classList.add('ss-freedom-show-hidden-empty'));
      element.querySelectorAll(':scope [ss-freedom-object] [ss-freedom-object] [ss-freedom-hidden-when-empty]')
        .forEach(e => e.classList.remove('ss-freedom-show-hidden-empty'));
    });
  }

  private removeHoverState() {
    this.element.removeEventListener('mouseleave', this.handleUpdate);

    if (this.optionsButton) {
      this.optionsButton.removeEventListener('mouseleave', this.handleUpdate);
      this.optionsButton.remove();
      delete this.optionsButton;
    }

    if (this.alertButton) {
      this.alertButton.removeEventListener('mouseleave', this.handleUpdate);
      this.alertButton.remove();
      delete this.alertButton;
    }
  }
}

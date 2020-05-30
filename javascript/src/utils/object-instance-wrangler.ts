import {ElementMetadata} from './element-metadata';

export class ObjectInstanceWrangler {
  private element: HTMLElement;
  private optionsButton: HTMLElement;
  private alertButton: HTMLElement;
  private elementHovered = false;
  private popupHovered = false;

  constructor(element: HTMLElement) {
    this.element = element;
    this.elementOverHandler = this.elementOverHandler.bind(this);
    this.elementLeaveHandler = this.elementLeaveHandler.bind(this);
    this.popupOverHandler = this.popupOverHandler.bind(this);
    this.popupLeaveHandler = this.popupLeaveHandler.bind(this);
    this.handleUpdate = this.debounce(this.handleUpdate.bind(this), 0);
    this.setup();
  }

  public setup() {
    this.element.addEventListener('mouseover', this.elementOverHandler);
  }

  public destroy() {
    this.element.removeEventListener('mouseover', this.elementOverHandler);
    this.removeHoverState();
  }

  private elementOverHandler() {
    this.elementHovered = true;
    this.popupHovered = false;
    this.handleUpdate();
  }

  private elementLeaveHandler() {
    this.elementHovered = false;
    this.handleUpdate();
  }

  private popupOverHandler() {
    this.popupHovered = true;
    this.handleUpdate();
  }

  private popupLeaveHandler() {
    this.popupHovered = false;
    this.handleUpdate();
  }

  private handleUpdate() {
    const hoveredPopup = document.querySelector([
      'ss-freedom-object-options-button:hover',
      'ss-freedom-object-options-panel:hover',
      'ss-freedom-object-alert-button:hover',
      '.tox:hover'
    ].join(','));
    if (hoveredPopup) {
      this.popupHovered = true;
      hoveredPopup.addEventListener('mouseleave', this.popupLeaveHandler);
    }

    if ((this.elementHovered || this.popupHovered) && !this.optionsButton && !this.alertButton) {
      this.activateHoverState();
    } else if (!(this.elementHovered || this.popupHovered) && (this.optionsButton || this.alertButton)) {
      this.removeHoverState();
    }
  }

  private debounce(method, delay) {
    let timeout;
    return () => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(method, delay);
    };
  }

  private activateHoverState() {
    this.element.addEventListener('mouseleave', this.elementLeaveHandler);

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
      element.querySelectorAll('[ss-freedom-object] [ss-freedom-object] [ss-freedom-object] [ss-freedom-hidden-when-empty]')
        .forEach(e => e.classList.remove('ss-freedom-show-hidden-empty'));
    });

    const metadata = ElementMetadata.getObjectData(this.element);

    if(metadata.hasOptions) {
      this.optionsButton = document.createElement('ss-freedom-object-options-button');
      this.optionsButton['element'] = this.element;
      this.optionsButton.setAttribute('ss-freedom-uid', metadata.uid);
      document.body.prepend(this.optionsButton);
    }

    if (metadata.alerts) {
      this.alertButton = document.createElement('ss-freedom-object-alert-button');
      this.alertButton['element'] = this.element;
      document.body.prepend(this.alertButton);
    }
  }

  private removeHoverState() {
    this.element.removeEventListener('mouseleave', this.elementLeaveHandler);

    if (this.optionsButton) {
      this.optionsButton.removeEventListener('mouseover', this.popupOverHandler);
      this.optionsButton.removeEventListener('mouseleave', this.popupLeaveHandler);
      this.optionsButton.remove();
      delete this.optionsButton;
    }

    if (this.alertButton) {
      this.alertButton.removeEventListener('mouseover', this.popupOverHandler);
      this.alertButton.removeEventListener('mouseleave', this.popupLeaveHandler);
      this.alertButton.remove();
      delete this.alertButton;
    }
  }
}

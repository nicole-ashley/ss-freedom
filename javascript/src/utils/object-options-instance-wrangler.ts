import {ElementMetadata} from "./element-metadata";

export class ObjectOptionsInstanceWrangler {
  private element: HTMLElement;
  private optionsButton: HTMLElement;
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
      '.tox:hover'
    ].join(','));
    if (hoveredPopup) {
      this.popupHovered = true;
      hoveredPopup.addEventListener('mouseleave', this.popupLeaveHandler);
    }

    if ((this.elementHovered || this.popupHovered) && !this.optionsButton) {
      this.activateHoverState();
    } else if (!(this.elementHovered || this.popupHovered) && this.optionsButton) {
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
    const elementBounds = this.element.getBoundingClientRect();
    this.element.addEventListener('mouseleave', this.elementLeaveHandler);
    this.element.classList.add('ss-freedom-show-hidden-empty');

    const widget = document.createElement('ss-freedom-object-options-button');
    this.configureObjectMetadata(widget);
    widget.style.position = 'absolute';
    widget.style.top = elementBounds.top + window.scrollY + 'px';
    widget.style.right = (document.body.clientWidth - elementBounds.right) + window.scrollX + 'px';

    document.body.appendChild(widget);
    this.optionsButton = widget;
  }

  private removeHoverState() {
    this.element.removeEventListener('mouseleave', this.elementLeaveHandler);
    this.element.classList.remove('ss-freedom-show-hidden-empty');

    if (this.optionsButton) {
      this.optionsButton.removeEventListener('mouseover', this.popupOverHandler);
      this.optionsButton.removeEventListener('mouseleave', this.popupLeaveHandler);
      this.optionsButton.remove();
      delete this.optionsButton;
    }
  }

  private configureObjectMetadata(widget) {
    const data = ElementMetadata.getObjectDataForFieldElement(this.element);
    widget.setAttribute('object-class', data.class);
    widget.setAttribute('object-id', data.id);
  }
}

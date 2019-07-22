import {Component, Element, h, Prop} from '@stencil/core';

@Component({
  tag: 'ss-freedom-object-options-button',
  styleUrl: 'ss-freedom-object-options-button.css',
  shadow: true
})
export class SsFreedomObjectOptionsButton {
  @Prop() objectClass!: string;
  @Prop() objectId!: string;

  @Element() private host: HTMLElement;

  private optionsWidget: HTMLElement;

  openOptionsWidget() {
    if (!this.optionsWidget) {
      this.optionsWidget = document.createElement('ss-freedom-object-options-panel');
      this.optionsWidget.setAttribute('object-class', this.objectClass);
      this.optionsWidget.setAttribute('object-id', this.objectId);
      this.optionsWidget.style.position = 'absolute';
      this.optionsWidget.style.top = this.host.style.top;
      this.optionsWidget.style.right = this.host.style.right;
    }
    document.body.appendChild(this.optionsWidget);
    this.host.remove();
  }

  render() {
    return (
      <button onClick={() => this.openOptionsWidget()}>
        <ion-icon name="settings"></ion-icon>
      </button>
    );
  }
}

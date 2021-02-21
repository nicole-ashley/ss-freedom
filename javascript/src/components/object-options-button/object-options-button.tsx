import {Component, Element, h, Prop} from '@stencil/core';
import {ElementFollower} from '../../utils/element-follower';

@Component({
  tag: 'ss-freedom-object-options-button',
  styleUrl: 'object-options-button.scss',
  shadow: true
})
export class ObjectOptionsButton {
  @Prop() element!: HTMLElement;

  @Element() private host: HTMLElement;
  private elementFollower: ElementFollower;
  private optionsWidget: HTMLSsFreedomObjectOptionsPanelElement;

  componentDidLoad() {
    this.elementFollower = new ElementFollower(this.element, this.host, {top: '0px', right: '0px'});
    this.elementFollower.startFollowing();
  }

  disconnectedCallback() {
    if (this.elementFollower) {
      this.elementFollower.stopFollowing();
    }
  }

  openOptionsWidget() {
    if (!this.optionsWidget) {
      this.optionsWidget = document.createElement('ss-freedom-object-options-panel');
      this.optionsWidget.element = this.element;
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
        <ion-icon name="settings"/>
      </button>
    );
  }
}

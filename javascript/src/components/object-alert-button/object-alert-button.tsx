import {Component, Element, h, Prop} from '@stencil/core';
import {ElementFollower} from '../../utils/element-follower';
import {ElementMetadata} from "../../utils/element-metadata";

@Component({
  tag: 'ss-freedom-object-alert-button',
  styleUrl: 'object-alert-button.scss',
  shadow: true
})
export class ObjectAlertButton {
  @Prop() element!: HTMLElement;

  @Element() private host: HTMLElement;
  private elementFollower: ElementFollower;

  componentDidLoad() {
    const offset = { top: '0px', right: '0px' };
    if (ElementMetadata.getObjectData(this.element).hasOptions) {
      offset.right = '3rem';
    }
    this.elementFollower = new ElementFollower(this.element, this.host, offset);
    this.elementFollower.startFollowing();
  }

  disconnectedCallback() {
    this.elementFollower.stopFollowing();
  }

  openAlert() {
    const alertData = this.alertData;
    let messages = alertData.error || alertData.warning || alertData.info;
    if (messages.length > 1) {
      messages = messages.map(message => `\u2022 ${message}`);
    }
    alert(messages.join('\n'));
  }

  get alertData() {
    const metadata = ElementMetadata.getObjectData(this.element);
    return metadata.alerts;
  }

  get iconName() {
    const alertData = this.alertData;
    if (alertData.error) {
      return 'alert';
    } else if (alertData.warning) {
      return 'warning';
    } else if (alertData.info) {
      return 'information-circle';
    }
  }

  render() {
    return (
      <button onClick={() => this.openAlert()}>
        <ion-icon name={this.iconName}/>
      </button>
    );
  }
}

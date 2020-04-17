import {Component, Element, h, Prop} from '@stencil/core';
import {ElementFollower} from '../../utils/element-follower';
import {ElementMetadata} from "../../utils/element-metadata";

@Component({
  tag: 'ss-freedom-object-alert-button',
  styleUrl: 'ss-freedom-object-alert-button.scss',
  shadow: true
})
export class SsFreedomObjectAlertButton {
  @Prop() element!: HTMLElement;

  @Element() private host: HTMLElement;
  private elementFollower: ElementFollower;

  componentDidLoad() {
    const offset = ElementMetadata.getObjectData(this.element).hasOptions ? {right: '3rem'} : null;
    this.elementFollower = new ElementFollower(this.element, this.host, offset);
    this.elementFollower.startFollowing();
  }

  componentDidUnload() {
    this.elementFollower.stopFollowing();
  }

  openAlert() {
    const alertData = this.alertData();
    let messages = alertData.error || alertData.warning || alertData.info;
    if (messages.length > 1) {
      messages = messages.map(message => `\u2022 ${message}`);
    }
    alert(messages.join('\n'));
  }

  alertData() {
    const metadata = ElementMetadata.getObjectData(this.element);
    return metadata.alerts;
  }

  iconName() {
    const alertData = this.alertData();
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
        <ion-icon name={this.iconName()}/>
      </button>
    );
  }
}

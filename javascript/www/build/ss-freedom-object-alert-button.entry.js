import { r as registerInstance, h, g as getElement } from './index-70ea5c31.js';
import './bounding-document-rect-5f9f0ba3.js';
import { E as ElementFollower } from './element-follower-74f8e4fa.js';
import { E as ElementMetadata } from './element-metadata-9d127272.js';

const objectAlertButtonCss = "*{font-family:-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", sans-serif}a{color:#207ab7;transition:color 300ms;text-decoration:none}a:hover{color:#1c6ca1;text-decoration:underline}a:active{color:#185d8c}*{box-sizing:border-box}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}button{appearance:none;border:solid 1px lightgrey;border-radius:3px;border-top-right-radius:0;box-shadow:0 0 1rem rgba(0, 0, 0, 0.1);background-color:white;padding:0.5rem;line-height:0;transition:background-color 300ms}button:hover{background-color:lightgrey}ion-icon{font-size:1.25rem}ion-icon[aria-label~=alert]{color:#b72020}ion-icon[aria-label~=warning]{color:#ffb720}ion-icon[aria-label~=information]{color:#207ab7}";

const ObjectAlertButton = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
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
    const alertData = this.alertData();
    if (alertData.error) {
      return 'alert';
    }
    else if (alertData.warning) {
      return 'warning';
    }
    else if (alertData.info) {
      return 'information-circle';
    }
  }
  render() {
    return (h("button", { onClick: () => this.openAlert() }, h("ion-icon", { name: this.iconName })));
  }
  get host() { return getElement(this); }
};
ObjectAlertButton.style = objectAlertButtonCss;

export { ObjectAlertButton as ss_freedom_object_alert_button };

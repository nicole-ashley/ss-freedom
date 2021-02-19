import { r as registerInstance, h, g as getElement } from './index-70ea5c31.js';
import './bounding-document-rect-5f9f0ba3.js';
import { E as ElementFollower } from './element-follower-74f8e4fa.js';

const objectOptionsButtonCss = "*{font-family:-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", sans-serif}a{color:#207ab7;transition:color 300ms;text-decoration:none}a:hover{color:#1c6ca1;text-decoration:underline}a:active{color:#185d8c}*{box-sizing:border-box}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}button{appearance:none;border:solid 1px lightgrey;border-radius:3px;border-top-right-radius:0;box-shadow:0 0 1rem rgba(0, 0, 0, 0.1);background-color:white;color:black;padding:0.5rem;line-height:0;transition:background-color 300ms}button:hover{background-color:lightgrey}ion-icon{font-size:1.25rem}";

const ObjectOptionsButton = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  componentDidLoad() {
    this.elementFollower = new ElementFollower(this.element, this.host, { top: '0px', right: '0px' });
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
    return (h("button", { onClick: () => this.openOptionsWidget() }, h("ion-icon", { name: "settings" })));
  }
  get host() { return getElement(this); }
};
ObjectOptionsButton.style = objectOptionsButtonCss;

export { ObjectOptionsButton as ss_freedom_object_options_button };

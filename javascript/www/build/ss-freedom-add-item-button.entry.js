import { r as registerInstance, h, e as Host, g as getElement } from './index-70ea5c31.js';
import { A as ApiService, E as ElementReplacement, a as AdminWidget } from './admin-widget-e8c9c8a6.js';
import './bounding-document-rect-5f9f0ba3.js';
import { E as ElementFollower } from './element-follower-74f8e4fa.js';
import { E as ElementMetadata } from './element-metadata-9d127272.js';

const addItemButtonCss = "*{font-family:-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", sans-serif}a{color:#207ab7;transition:color 300ms;text-decoration:none}a:hover{color:#1c6ca1;text-decoration:underline}a:active{color:#185d8c}*{box-sizing:border-box}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}:host{display:flex;min-width:1px;min-height:1px;background:lightgrey}button{position:relative;display:block;flex:1;justify-self:stretch;appearance:none;background:none;border:0;margin:-1rem}button:disabled{color:black}div{border:solid 1px lightgrey;border-radius:3px;border-top-right-radius:0;box-shadow:0 0 1rem rgba(0, 0, 0, 0.1);background-color:white;position:absolute;left:calc(50% - 0.5rem - 1px);top:calc(50% - 0.5rem - 1px);line-height:0;transition:background-color 300ms}button:not([disabled]):hover div{background-color:lightgrey}ion-icon{font-size:1rem}:host([processing]) ion-icon{animation:1s infinite linear spin}";

const AddItemButton = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.processing = false;
    this.api = new ApiService();
  }
  componentDidLoad() {
    this.elementFollower = new ElementFollower(this.element, this.host, this.offset);
    this.elementFollower.startFollowing();
  }
  disconnectedCallback() {
    if (this.elementFollower) {
      this.elementFollower.stopFollowing();
    }
  }
  async addItem() {
    this.processing = true;
    const elementId = this.element.hasAttribute('ss-freedom-object') && ElementMetadata.getObjectData(this.element).id;
    const siblingId = this.adjacentSibling && ElementMetadata.getObjectData(this.adjacentSibling).id;
    const elementIds = [elementId];
    if (!(this.offset.top && this.offset.left)) {
      elementIds.push(siblingId);
    }
    else {
      elementIds.unshift(siblingId);
    }
    const relationMetadata = ElementMetadata.getDataForClosestRelation(this.element);
    const newDocument = await this.api.addItemToList(relationMetadata.class, relationMetadata.id, relationMetadata.relation, elementIds);
    Array.from(document.querySelectorAll(`[ss-freedom-object="${relationMetadata.uid}"] [ss-freedom-relation="${relationMetadata.relation}"]`)).forEach((el) => {
      ElementReplacement.replaceObjectWithMostLikelyEquivalent(el, newDocument);
    });
    this.host.remove();
    AdminWidget.RefreshPublishedStatus();
  }
  render() {
    return h(Host, null, h("button", { onClick: () => this.addItem(), disabled: this.processing }, h("div", null, h("ion-icon", { name: this.processing ? 'refresh' : 'add' }))));
  }
  get host() { return getElement(this); }
};
AddItemButton.style = addItemButtonCss;

export { AddItemButton as ss_freedom_add_item_button };

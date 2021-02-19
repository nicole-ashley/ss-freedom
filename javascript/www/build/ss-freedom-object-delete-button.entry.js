import { r as registerInstance, h, g as getElement } from './index-70ea5c31.js';
import { A as ApiService, E as ElementReplacement, a as AdminWidget } from './admin-widget-e8c9c8a6.js';
import './bounding-document-rect-5f9f0ba3.js';
import { E as ElementFollower } from './element-follower-74f8e4fa.js';
import { E as ElementMetadata } from './element-metadata-9d127272.js';

const objectDeleteButtonCss = "*{font-family:-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", sans-serif}a{color:#207ab7;transition:color 300ms;text-decoration:none}a:hover{color:#1c6ca1;text-decoration:underline}a:active{color:#185d8c}*{box-sizing:border-box}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}button{appearance:none;border:solid 1px lightgrey;border-radius:3px;border-top-right-radius:0;box-shadow:0 0 1rem rgba(0, 0, 0, 0.1);background-color:white;padding:0.5rem;line-height:0;transition:background-color 300ms}button:not([disabled]):hover{background-color:lightgrey}button[disabled]{color:black}ion-icon{font-size:1.25rem}:host([processing]) ion-icon{animation:1s infinite linear spin}";

const ObjectDeleteButton = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.processing = false;
    this.deleteMethod = null;
    this.api = new ApiService();
  }
  componentWillLoad() {
    this.metadata = ElementMetadata.getObjectData(this.element);
    if (this.metadata.deleteMethod) {
      this.deleteMethod = this.metadata.deleteMethod;
    }
    else if (this.element.parentElement.hasAttribute('ss-freedom-relation')) {
      const relationMetadata = ElementMetadata.getDataForClosestRelation(this.element);
      this.deleteMethod = relationMetadata.removeMethod;
    }
    else {
      this.host.remove();
      return;
    }
  }
  componentDidLoad() {
    const offset = { top: '0px', right: null };
    let rightOffset = 0;
    if (this.metadata.hasOptions) {
      rightOffset += 3;
    }
    if (this.metadata.alerts) {
      rightOffset += 3;
    }
    offset.right = `${rightOffset}rem`;
    this.elementFollower = new ElementFollower(this.element, this.host, offset);
    this.elementFollower.startFollowing();
  }
  disconnectedCallback() {
    var _a;
    (_a = this.elementFollower) === null || _a === void 0 ? void 0 : _a.stopFollowing();
  }
  confirmDelete() {
    this.processing = true;
    const confirmation = confirm(this.confirmationMessage);
    if (!confirmation) {
      this.processing = false;
    }
    else {
      this.doDelete();
    }
  }
  async doDelete() {
    const metadata = ElementMetadata.getObjectData(this.element);
    const relationMetadata = ElementMetadata.getDataForClosestRelation(this.element);
    const newDocument = await (this.deleteMethod === 'delete' ?
      this.api.deleteObject(metadata.class, metadata.id) :
      this.api.removeItemFromList(relationMetadata.class, relationMetadata.id, relationMetadata.relation, metadata.id));
    Array.from(document.querySelectorAll(`[ss-freedom-object="${relationMetadata.uid}"] [ss-freedom-relation="${relationMetadata.relation}"]`)).forEach((el) => {
      ElementReplacement.replaceObjectWithMostLikelyEquivalent(el, newDocument);
    });
    this.host.remove();
    AdminWidget.RefreshPublishedStatus();
  }
  get confirmationMessage() {
    return this.deleteMethod === 'delete' ?
      'Are you sure you want to delete this item? This will take immediate effect on the live site and cannot be undone.' :
      'Are you sure you want to remove this item? This will take immediate effect on the live site but will not affect other usages of this object.';
  }
  get icon() {
    if (this.processing) {
      return 'refresh';
    }
    else {
      return this.deleteMethod === 'delete' ? 'trash' : 'close';
    }
  }
  render() {
    return (h("button", { onClick: () => this.confirmDelete(), disabled: this.processing }, h("ion-icon", { name: this.icon })));
  }
  get host() { return getElement(this); }
};
ObjectDeleteButton.style = objectDeleteButtonCss;

export { ObjectDeleteButton as ss_freedom_object_delete_button };

import { r as registerInstance, h, e as Host, g as getElement } from './index-70ea5c31.js';
import { A as ApiService, a as AdminWidget, E as ElementReplacement } from './admin-widget-e8c9c8a6.js';
import './bounding-document-rect-5f9f0ba3.js';
import { E as ElementFollower } from './element-follower-74f8e4fa.js';
import { E as ElementMetadata } from './element-metadata-9d127272.js';

const objectOptionsPanelCss = "*{font-family:-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", sans-serif}a{color:#207ab7;transition:color 300ms;text-decoration:none}a:hover{color:#1c6ca1;text-decoration:underline}a:active{color:#185d8c}*{box-sizing:border-box}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}:host{box-sizing:border-box;border:solid 1px lightgrey;border-radius:3px;border-top-right-radius:0;box-shadow:0 0 1rem rgba(0, 0, 0, 0.1);background-color:white;color:black;padding:0.5rem;line-height:0}:host(.loaded){border-left-style:double;border-left-width:3px;width:var(--width);min-width:var(--initial-width);max-width:100%}ion-icon{animation:1s infinite linear spin;font-size:1.25rem}form{margin:0;line-height:1}fieldset{border:0;padding:0.5rem;margin:0}.field{margin-bottom:0.5rem}label{color:rgba(34, 47, 62, 0.7);font-size:0.875rem}.middleColumn{margin-top:0.2rem;margin-bottom:0.5rem}input:not([type=checkbox]):not([type=radio]),select,textarea{border:solid 1px #ccc;border-radius:3px;padding:0.31rem 0.29rem;font-size:1rem;min-width:100%}input[type=checkbox],input[type=radio]{transform:translateY(2px)}input,select,textarea,button{font-size:1rem}button{float:right;margin-right:0.5rem;margin-bottom:0.5rem}button:not([type=submit]){appearance:none;border-radius:3px;border:none;padding:0.25rem 1rem;font-size:1rem;font-weight:bold;line-height:1.5rem;transition:background-color 300ms}button:not([type=submit]):disabled{color:rgba(0, 0, 0, 0.3);background-color:#f0f0f0}button:not([type=submit]):not(:disabled){color:#222f3e;background-color:#f0f0f0}button:not([type=submit]):not(:disabled):hover{background-color:#e3e3e3}button:not([type=submit]):not(:disabled):active{background-color:#d6d6d6}button[type=submit]{appearance:none;border-radius:3px;border:none;padding:0.25rem 1rem;font-size:1rem;font-weight:bold;line-height:1.5rem;transition:background-color 300ms}button[type=submit]:disabled{color:rgba(0, 0, 0, 0.3);background-color:#f0f0f0}button[type=submit]:not(:disabled){color:#fff;background-color:#207ab7}button[type=submit]:not(:disabled):hover{background-color:#1c6ca1}button[type=submit]:not(:disabled):active{background-color:#185d8c}.horizontal-resize{position:absolute;width:1rem;height:100%;top:0;left:-0.5rem;z-index:1;cursor:ew-resize;user-select:none}";

const ObjectOptionsPanel = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.processing = true;
    this.api = new ApiService();
    this.instantiateOptionsForm();
  }
  componentDidLoad() {
    this.elementFollower = new ElementFollower(this.element, this.host, { top: '0px', right: '0px' });
    this.elementFollower.startFollowing();
  }
  disconnectedCallback() {
    this.elementFollower.stopFollowing();
  }
  startHorizontalDrag() {
    const handler = this.handleHorizontalDrag.bind(this);
    document.body.addEventListener('pointermove', handler);
    document.body.addEventListener('pointerup', () => document.body.removeEventListener('pointermove', handler), {
      once: true
    });
  }
  handleHorizontalDrag(event) {
    const newWidth = this.host.getBoundingClientRect().right - event.clientX;
    this.host.style.setProperty('--width', newWidth + 'px');
  }
  async instantiateOptionsForm() {
    this.metadata = ElementMetadata.getDataForClosestObjectElement(this.element);
    this.formHtml = await this.api.getOptionsForm(this.metadata.class, this.metadata.id);
    this.processing = false;
    window.requestAnimationFrame(() => {
      this.host.style.setProperty('--initial-width', this.host.getBoundingClientRect().width + 'px');
    });
  }
  async saveChanges() {
    this.processing = true;
    const fields = Array.from(this.formWrapper.querySelectorAll('[name]'));
    const formData = fields.reduce((data, field) => {
      if (field instanceof HTMLInputElement) {
        data[field.name] = field.type === 'checkbox' ? field.checked : field.value;
      }
      else if (field instanceof HTMLSelectElement) {
        data[field.name] = field.options[field.selectedIndex].value;
      }
      else if (field instanceof HTMLTextAreaElement) {
        data[field.name] = field.value;
      }
      return data;
    }, {});
    const newDocument = await this.api.updateObject(this.metadata.class, this.metadata.id, formData);
    this.updateObjectHtml(newDocument);
    this.close();
    AdminWidget.RefreshPublishedStatus();
  }
  updateObjectHtml(newDocument) {
    Array.from(document.querySelectorAll(`[ss-freedom-object="${this.metadata.uid}"]`)).forEach((el) => ElementReplacement.replaceObjectWithMostLikelyEquivalent(el, newDocument));
    this.removeOptionsButtonForOldObject();
  }
  removeOptionsButtonForOldObject() {
    const selector = `ss-freedom-object-options-button[ss-freedom-uid="${this.metadata.uid}"]`;
    Array.from(document.querySelectorAll(selector)).forEach((el) => el.remove());
  }
  close() {
    this.host.remove();
  }
  render() {
    if (this.processing) {
      return h("ion-icon", { name: "refresh" });
    }
    else {
      return (h(Host, { class: "loaded" }, h("div", { ref: (el) => (this.formWrapper = el), innerHTML: this.formHtml }), h("button", { type: "submit", onClick: () => this.saveChanges() }, "Save"), h("button", { onClick: () => this.close() }, "Cancel"), h("div", { class: "horizontal-resize", onPointerDown: () => this.startHorizontalDrag() })));
    }
  }
  get host() { return getElement(this); }
};
ObjectOptionsPanel.style = objectOptionsPanelCss;

export { ObjectOptionsPanel as ss_freedom_object_options_panel };

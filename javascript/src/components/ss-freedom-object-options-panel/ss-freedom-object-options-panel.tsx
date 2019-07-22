import {Component, Element, h, Host, Prop, State} from '@stencil/core';
import {ApiService} from '../../utils/api-service';

@Component({
  tag: 'ss-freedom-object-options-panel',
  styleUrl: 'ss-freedom-object-options-panel.css',
  shadow: true
})
export class SsFreedomObjectOptionsPanel {
  @Prop() objectClass!: string;
  @Prop() objectId!: string;

  private api: ApiService;
  private formWrapper: HTMLElement;
  @Element() private host: HTMLElement;
  @State() private loading = true;
  @State() private formHtml: string;

  constructor() {
    this.api = new ApiService();
    this.instantiateOptionsForm();
  }

  async instantiateOptionsForm() {
    this.formHtml = await this.api.getOptionsForm(this.objectClass, this.objectId);
    this.loading = false;
  }

  async saveChanges() {
    this.loading = true;
    const fields = Array.from(this.formWrapper.querySelectorAll('[name]'));
    const formData = fields.reduce((data, field) => {
      if (field instanceof HTMLInputElement) {
        data[field.name] = field.value;
      } else if (field instanceof HTMLSelectElement) {
        data[field.name] = field.options[field.selectedIndex].value;
      } else if (field instanceof HTMLTextAreaElement) {
        data[field.name] = field.innerHTML;
      }
      return data;
    }, {});
    const newHtml = await this.api.updateObject(this.objectClass, this.objectId, formData);
    this.updateObjectHtml(newHtml);
    this.close();
  }

  private updateObjectHtml(newHtml: string) {
    const criteria = [
      `[data-ss-freedom-object*='"class":"${this.objectClass.replace(/\\/g, '\\\\\\\\')}"']`,
      `[data-ss-freedom-object*='"id":${this.objectId}']`
    ];
    Array.from(document.querySelectorAll(criteria.join(''))).forEach(el => el.outerHTML = newHtml);
    this.removeOptionsButtonForOldObject();
  }

  private removeOptionsButtonForOldObject() {
    const criteria = [
      `ss-freedom-object-options-button[object-class="${this.objectClass.replace(/\\/g, '\\\\')}"]`,
        `[object-id="${this.objectId}"]`
    ];
    Array.from(document.querySelectorAll(criteria.join(''))).forEach(el => el.remove());
  }

  private close() {
    this.host.remove();
  }

  render() {
    if (this.loading) {
      return <ion-icon className="loading" name="sync"></ion-icon>;
    } else {
      return (
        <Host>
          <div ref={el => this.formWrapper = el} innerHTML={this.formHtml}></div>
          <button onClick={() => this.saveChanges()}>Save</button>
          <button onClick={() => this.close()}>Cancel</button>
        </Host>
      );
    }
  }
}

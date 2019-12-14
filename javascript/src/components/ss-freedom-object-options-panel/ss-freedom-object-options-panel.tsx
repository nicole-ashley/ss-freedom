import {Component, Element, h, Host, Prop, State} from '@stencil/core';
import {ApiService} from '../../utils/api-service';
import {ElementMetadata} from '../../utils/element-metadata';
import {ElementFollower} from '../../utils/element-follower';

@Component({
  tag: 'ss-freedom-object-options-panel',
  styleUrl: 'ss-freedom-object-options-panel.scss',
  shadow: true
})
export class SsFreedomObjectOptionsPanel {
  @Prop() element!: HTMLElement;

  @Element() private host: HTMLElement;
  @State() private loading = true;
  @State() private formHtml: string;
  private elementFollower: ElementFollower;
  private metadata: { class: string; id: number };
  private api: ApiService;
  private formWrapper: HTMLElement;

  constructor() {
    this.api = new ApiService();
    this.instantiateOptionsForm();
  }

  componentDidLoad() {
    this.elementFollower = new ElementFollower(this.element, this.host);
    this.elementFollower.startFollowing();
  }

  componentDidUnload() {
    this.elementFollower.stopFollowing();
  }

  async instantiateOptionsForm() {
    this.metadata = ElementMetadata.getObjectDataForFieldElement(this.element);
    this.formHtml = await this.api.getOptionsForm(this.metadata.class, this.metadata.id);
    this.loading = false;
  }

  async saveChanges() {
    this.loading = true;
    const fields = Array.from(this.formWrapper.querySelectorAll('[name]'));
    const formData = fields.reduce((data, field) => {
      if (field instanceof HTMLInputElement) {
        data[field.name] = field.type === 'checkbox' ? field.checked : field.value;
      } else if (field instanceof HTMLSelectElement) {
        data[field.name] = field.options[field.selectedIndex].value;
      } else if (field instanceof HTMLTextAreaElement) {
        data[field.name] = field.value;
      }
      return data;
    }, {});
    const newHtml = await this.api.updateObject(this.metadata.class, this.metadata.id, formData);
    this.updateObjectHtml(newHtml);
    this.close();
  }

  private updateObjectHtml(newHtml: string) {
    const criteria = [
      `[data-ss-freedom-object*='"class":"${this.metadata.class.replace(/\\/g, '\\\\\\\\')}"']`,
      `[data-ss-freedom-object*='"id":${this.metadata.id}']`
    ];
    Array.from(document.querySelectorAll(criteria.join(''))).forEach(el => el.outerHTML = newHtml);
    this.removeOptionsButtonForOldObject();
  }

  private removeOptionsButtonForOldObject() {
    const criteria = [
      `ss-freedom-object-options-button[object-class="${this.metadata.class.replace(/\\/g, '\\\\')}"]`,
      `[object-id="${this.metadata.id}"]`
    ];
    Array.from(document.querySelectorAll(criteria.join(''))).forEach(el => el.remove());
  }

  private close() {
    this.host.remove();
  }

  render() {
    if (this.loading) {
      return <ion-icon name="sync"></ion-icon>;
    } else {
      return (
        <Host>
          <div ref={el => this.formWrapper = el} innerHTML={this.formHtml}></div>
          <button type="submit" onClick={() => this.saveChanges()}>Save</button>
          <button onClick={() => this.close()}>Cancel</button>
        </Host>
      );
    }
  }
}

import { Component, Element, h, Host, Prop, State } from '@stencil/core';
import { ApiService } from '../../utils/api-service';
import { ElementMetadata } from '../../utils/element-metadata';
import { ElementFollower } from '../../utils/element-follower';
import { SsFreedomAdminWidget } from '../ss-freedom-admin-widget/ss-freedom-admin-widget';
import { ElementReplacement } from '../../utils/element-replacement';

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
  private metadata: { uid: string, class: string; id: number };
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

  startHorizontalDrag() {
    const handler = this.handleHorizontalDrag.bind(this);
    document.body.addEventListener('pointermove', handler);
    document.body.addEventListener('pointerup', () => document.body.removeEventListener('pointermove', handler), {
      once: true
    });
  }

  handleHorizontalDrag(event: PointerEvent) {
    const newWidth = this.host.getBoundingClientRect().right - event.clientX;
    this.host.style.setProperty('--width', newWidth + 'px');
  }

  async instantiateOptionsForm() {
    this.metadata = ElementMetadata.getObjectDataForFieldElement(this.element);
    this.formHtml = await this.api.getOptionsForm(this.metadata.class, this.metadata.id);
    this.loading = false;
    window.requestAnimationFrame(() => {
      this.host.style.setProperty('--initial-width', this.host.getBoundingClientRect().width + 'px');
    });
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
    const newDocument = await this.api.updateObject(this.metadata.class, this.metadata.id, formData);
    this.updateObjectHtml(newDocument);
    this.close();
    SsFreedomAdminWidget.RefreshPublishedStatus();
  }

  private updateObjectHtml(newDocument: Document) {
    Array.from(document.querySelectorAll(`[ss-freedom-object="${this.metadata.uid}"]`)).forEach((el) =>
      ElementReplacement.replaceObjectWithMostLikelyEquivalent(el as HTMLElement, newDocument)
    );
    this.removeOptionsButtonForOldObject();
  }

  private removeOptionsButtonForOldObject() {
    const selector = `ss-freedom-object-options-button[ss-freedom-uid="${this.metadata.uid}"]`;
    Array.from(document.querySelectorAll(selector)).forEach((el) => el.remove());
  }

  private close() {
    this.host.remove();
  }

  render() {
    if (this.loading) {
      return <ion-icon name="sync" />;
    } else {
      return (
        <Host class="loaded">
          <div ref={(el) => (this.formWrapper = el)} innerHTML={this.formHtml}></div>
          <button type="submit" onClick={() => this.saveChanges()}>
            Save
          </button>
          <button onClick={() => this.close()}>Cancel</button>
          <div class="horizontal-resize" onPointerDown={() => this.startHorizontalDrag()}></div>
        </Host>
      );
    }
  }
}

import { Component, Element, h, Host, Prop } from '@stencil/core';
import { ApiService } from '../../utils/api-service';
import { ElementFollower, Offset } from '../../utils/element-follower';
import { ElementMetadata } from '../../utils/element-metadata';
import { ElementReplacement } from '../../utils/element-replacement';
import { AdminWidget } from '../admin-widget/admin-widget';

@Component({
  tag: 'ss-freedom-add-item-button',
  styleUrl: 'add-item-button.scss',
  shadow: true
})
export class AddItemButton {
  @Prop() element!: HTMLElement;
  @Prop() adjacentSibling: HTMLElement;
  @Prop() offset!: Offset;
  @Prop({reflect: true}) processing = false;

  @Element() private host: HTMLElement;
  private elementFollower: ElementFollower;
  private api: ApiService;

  constructor() {
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
    } else {
      elementIds.unshift(siblingId);
    }

    const relationMetadata = ElementMetadata.getDataForClosestRelation(this.element);
    const newDocument = await this.api.addItemToList(
      relationMetadata.class,
      relationMetadata.id,
      relationMetadata.relation,
      elementIds
    );

    Array.from(
      document.querySelectorAll(
        `[ss-freedom-object="${relationMetadata.uid}"] [ss-freedom-relation="${relationMetadata.relation}"]`
      )
    ).forEach((el) => {
      ElementReplacement.replaceObjectWithMostLikelyEquivalent(el as HTMLElement, newDocument)
    });

    this.host.remove();
    AdminWidget.RefreshPublishedStatus();
  }

  render() {
    return <Host>
      <button onClick={() => this.addItem()} disabled={this.processing}>
        <div><ion-icon name={this.processing ? 'refresh' : 'add'} /></div>
      </button>
    </Host>;
  }
}

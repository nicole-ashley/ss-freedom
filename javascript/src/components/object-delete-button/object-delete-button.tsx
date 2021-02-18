import {Component, Element, h, Prop} from '@stencil/core';
import { ApiService } from '../../utils/api-service';
import {ElementFollower} from '../../utils/element-follower';
import {ElementMetadata} from "../../utils/element-metadata";
import { ElementReplacement } from '../../utils/element-replacement';
import { AdminWidget } from '../admin-widget/admin-widget';

@Component({
  tag: 'ss-freedom-object-delete-button',
  styleUrl: 'object-delete-button.scss',
  shadow: true
})
export class ObjectDeleteButton {
  @Prop() element!: HTMLElement;
  @Prop({reflect: true}) processing = false;

  @Element() private host: HTMLElement;
  private metadata: {deleteMethod?: 'delete' | 'unlink', hasOptions?: boolean, alerts?: []}
  private elementFollower: ElementFollower;
  private deleteMethod: 'delete' | 'unlink' = null;
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  componentWillLoad() {
    this.metadata = ElementMetadata.getObjectData(this.element);

    if (this.metadata.deleteMethod) {
      this.deleteMethod = this.metadata.deleteMethod;
    } else if (this.element.parentElement.hasAttribute('ss-freedom-relation')) {
      const relationMetadata = ElementMetadata.getDataForClosestRelation(this.element);
      this.deleteMethod = relationMetadata.removeMethod;
    } else {
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
    this.elementFollower?.stopFollowing();
  }

  confirmDelete() {
    this.processing = true;
    const confirmation = confirm(this.confirmationMessage);

    if (!confirmation) {
      this.processing = false;
    } else {
      this.doDelete();
    }
  }

  async doDelete() {
    const metadata = ElementMetadata.getObjectData(this.element);
      const relationMetadata = ElementMetadata.getDataForClosestRelation(this.element);
      const newDocument = await(this.deleteMethod === 'delete' ?
        this.api.deleteObject(metadata.class, metadata.id) :
        this.api.removeItemFromList(
        relationMetadata.class,
        relationMetadata.id,
        relationMetadata.relation,
        metadata.id
      ));

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

  get confirmationMessage() {
    return this.deleteMethod === 'delete' ?
      'Are you sure you want to delete this item? This will take immediate effect on the live site and cannot be undone.':
      'Are you sure you want to remove this item? This will take immediate effect on the live site but will not affect other usages of this object.' 
  }

  get icon() {
    if (this.processing) {
      return 'refresh';
    } else {
      return this.deleteMethod === 'delete' ? 'trash' : 'close';
    }
  }

  render() {
    return (
      <button onClick={() => this.confirmDelete()} disabled={this.processing}>
        <ion-icon name={this.icon}/>
      </button>
    );
  }
}

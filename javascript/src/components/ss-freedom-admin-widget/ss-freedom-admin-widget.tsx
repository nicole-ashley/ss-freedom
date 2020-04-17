import {Component, h, Method, Prop, State} from '@stencil/core';
import {TinyMceWrangler} from '../../utils/tiny-mce-wrangler';
import {ObjectWrangler} from '../../utils/object-wrangler';
import {ApiService} from "../../utils/api-service";

@Component({
  tag: 'ss-freedom-admin-widget',
  styleUrl: 'ss-freedom-admin-widget.scss',
  shadow: true
})
export class SsFreedomAdminWidget {
  @Prop() pageId: number;
  @Prop() pageClassName: string;
  @Prop() stage: 'Stage' | 'Live';
  @Prop() canPublish: boolean;
  @Prop() isPublished: boolean;
  @Prop() cmsEditLink: string;
  @State() private isOpen = false;
  private api: ApiService;
  private stageDropdown: HTMLSelectElement;

  static async RefreshPublishedStatus() {
    document.querySelectorAll('ss-freedom-admin-widget')
      .forEach((widget: any) => widget.refreshPublishedStatus());
  }

  constructor() {
    this.api = new ApiService();
  }

  componentWillLoad() {
    if (this.stage !== 'Live') {
      new TinyMceWrangler().observeDom();
      new ObjectWrangler().observeDom();
    }
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  @Method()
  async refreshPublishedStatus() {
    const {published} = await this.api.getObjectInfo(this.pageClassName, this.pageId);
    this.isPublished = published;
  }

  private changeStage() {
    const newStage = this.stageDropdown.value;
    const url = new URL(window.location.toString());
    if (newStage === 'Live') {
      url.searchParams.delete('stage')
    } else {
      url.searchParams.set('stage', newStage);
    }
    window.location.replace(url.toString());
  }

  private async publishPage(target: EventTarget) {
    const button = (target as HTMLElement).closest('button');
    button.disabled = true;
    button.classList.add('publishing');
    await this.api.publishObject(this.pageClassName, this.pageId);
    window.location.reload();
  }

  render() {
    return (
      <div class={this.isOpen ? 'open' : 'closed'}>
        <form>
          <label>
            Stage:
            <select ref={el => this.stageDropdown = el} onChange={() => this.changeStage()}>
              <option selected={this.stage === 'Stage'} value="Stage">Staging</option>
              <option selected={this.stage === 'Live'} value="Live">Live</option>
            </select>
          </label>
          {this.cmsEditLink &&
          <a href={this.cmsEditLink}>Edit in CMS</a>
          }
          {this.stage !== 'Live' && this.canPublish &&
          <button type="button"
                  class={this.isPublished ? 'published' : 'publish'}
                  onClick={e => this.publishPage(e.target)}>
            <ion-icon class="loading" name="sync"/>
            <span>{this.isPublished ? 'Published' : 'Publish'}</span>
          </button>
          }
          {/*{this.stage !== 'Live' &&
          <button type="button" class="settings">
            <ion-icon name="settings"/>
          </button>
          }*/}
          <button type="button" class="close" onClick={() => this.close()}>
            <ion-icon name="close"/>
          </button>
        </form>
        <button class="silverstripe" onClick={() => this.open()}/>
      </div>
    );
  }
}

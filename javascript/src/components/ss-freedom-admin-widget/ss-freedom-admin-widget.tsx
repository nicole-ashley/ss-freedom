import {Component, h, Prop, State} from '@stencil/core';
import {TinyMceWrangler} from '../../utils/tiny-mce-wrangler';
import {ObjectOptionsWrangler} from '../../utils/object-options-wrangler';
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
  private wrapper: HTMLElement;
  private widgetForm: HTMLElement;
  private stageDropdown: HTMLSelectElement;

  constructor() {
    this.api = new ApiService();
  }

  componentWillLoad() {
    if (this.stage !== 'Live') {
      new TinyMceWrangler().observeDom();
      new ObjectOptionsWrangler().observeDom();
    }
  }

  open() {
    this.isOpen = true;
    window.setTimeout(() => {
      const formSize = this.widgetForm.getBoundingClientRect();
      this.wrapper.style.setProperty('--width', formSize.width + 'px');
      this.wrapper.style.setProperty('--height', formSize.height + 'px');
    }, 0);
  }

  close() {
    this.isOpen = false;
    this.wrapper.style.removeProperty('--width');
    this.wrapper.style.removeProperty('--height');
  }

  changeStage() {
    const newStage = this.stageDropdown.value;
    const url = new URL(window.location.toString());
    if (newStage === 'Live') {
      url.searchParams.delete('stage')
    } else {
      url.searchParams.set('stage', newStage);
    }
    window.location.replace(url.toString());
  }

  async publishPage(target: EventTarget) {
    const button = (target as HTMLElement).closest('button');
    button.disabled = true;
    button.classList.add('publishing');
    await this.api.publishObject(this.pageClassName, this.pageId);
    button.disabled = false;
    window.location.reload();
  }

  render() {
    return (
      <div class={this.isOpen ? 'open' : 'closed'} ref={el => this.wrapper = el}>
        <form ref={el => this.widgetForm = el}>
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

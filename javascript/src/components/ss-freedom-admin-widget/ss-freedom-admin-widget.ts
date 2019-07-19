import {Component} from '@stencil/core';
import {TinyMceWrangler} from '../../utils/tiny-mce-wrangler';
import {ObjectOptionsWrangler} from '../../utils/object-options-wrangler';

@Component({
  tag: 'ss-freedom-admin-widget',
  shadow: true
})
export class SsFreedomAdminWidget {
  componentWillLoad() {
    new TinyMceWrangler().observeDom();
    new ObjectOptionsWrangler().observeDom();
  }

  render() {
    return;
  }
}

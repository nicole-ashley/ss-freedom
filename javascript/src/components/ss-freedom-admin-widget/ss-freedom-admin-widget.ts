import {Component} from '@stencil/core';
import {TinyMceWrangler} from '../../utils/tiny-mce-wrangler';

@Component({
  tag: 'ss-freedom-admin-widget',
  shadow: true
})
export class SsFreedomAdminWidget {
  componentWillLoad() {
    new TinyMceWrangler().observeDom();
  }

  render() {
    return;
  }
}

import {Component, Prop} from '@stencil/core';
import {DomObserver} from '../../services/dom-observer';

@Component({
  tag: 'ssfreedom-admin-widget',
  styleUrl: 'admin-widget.css',
  shadow: true
})
export class AdminWidget {

  @Prop() first: string;
  @Prop() last: string;

  componentDidLoad() {
    (new DomObserver()).observeDom();
  }

  render() {
    return (
      <p></p>
    );
  }
}

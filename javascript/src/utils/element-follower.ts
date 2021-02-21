import { BoundingDocumentRect } from './bounding-document-rect';

export interface Offset {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}
export class ElementFollower {
  private interval;

  constructor(
    private target: Element,
    private follower: HTMLElement,
    private offset: Offset = {}
  ) {
    this.follower.style.setProperty('--offset-top', this.offset.top);
    this.follower.style.setProperty('--offset-right', this.offset.right);
    this.follower.style.setProperty('--offset-bottom', this.offset.bottom);
    this.follower.style.setProperty('--offset-left', this.offset.left);
  }

  public startFollowing() {
    this.follower.style.position = 'absolute';
    this.follower.style.top = 'calc(var(--target-top) - 1px + var(--offset-top))';
    this.follower.style.right = 'calc((var(--document-width) - var(--target-right)) - 1px + var(--offset-right))';
    this.follower.style.bottom = 'calc((var(--document-height) - var(--target-bottom)) - 1px + var(--offset-bottom))';
    this.follower.style.left = 'calc(var(--target-left) - 1px + var(--offset-left))';
    this.interval = window.setInterval(() => this.updateScreenPosition(), 10);
    this.updateScreenPosition();
  }

  public stopFollowing() {
    window.clearInterval(this.interval);
  }

  private updateScreenPosition() {
    const targetBounds = BoundingDocumentRect.for(this.target);
    const bodyBounds = document.body.getBoundingClientRect();
    this.follower.style.setProperty('--document-width', bodyBounds.width + 'px');
    this.follower.style.setProperty('--document-height', bodyBounds.height + 'px');
    this.follower.style.setProperty('--target-top', targetBounds.top + 'px');
    this.follower.style.setProperty('--target-right', targetBounds.right + 'px');
    this.follower.style.setProperty('--target-bottom', targetBounds.bottom + 'px');
    this.follower.style.setProperty('--target-left', targetBounds.left + 'px');
  }
}

export class ElementFollower {
  private interval;

  constructor(
    private target: HTMLElement,
    private follower: HTMLElement,
    private offset: {right?: string, top?: string} = null
  ) {
    this.follower.style.setProperty('--offset-top', this.offset?.top || '0px');
    this.follower.style.setProperty('--offset-right', this.offset?.right || '0px');
  }

  public startFollowing() {
    this.interval = window.setInterval(() => this.updateScreenPosition(), 10);
    this.follower.style.position = 'absolute';
    this.follower.style.top = 'calc(var(--target-top) + var(--scroll-y) - 1px + var(--offset-top))';
    this.follower.style.right = 'calc((var(--document-width) - var(--target-right)) + var(--scroll-x) - 1px + var(--offset-right))';
  }

  public stopFollowing() {
    window.clearInterval(this.interval);
  }

  private updateScreenPosition() {
    const targetBounds = this.target.getBoundingClientRect();
    this.follower.style.setProperty('--document-width', document.body.clientWidth + 'px');
    this.follower.style.setProperty('--target-top', targetBounds.top + 'px');
    this.follower.style.setProperty('--target-right', targetBounds.right + 'px');
    this.follower.style.setProperty('--scroll-y', window.scrollY + 'px');
    this.follower.style.setProperty('--scroll-x', window.scrollX + 'px');
  }
}

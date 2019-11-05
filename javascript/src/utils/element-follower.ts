export class ElementFollower {
  private interval;

  constructor(
    private target: HTMLElement,
    private follower: HTMLElement
  ) {}

  public startFollowing() {
    this.interval = window.setInterval(() => this.updateScreenPosition(), 10);
  }

  public stopFollowing() {
    window.clearInterval(this.interval);
  }

  private updateScreenPosition() {
    const targetBounds = this.target.getBoundingClientRect();
    this.follower.style.position = 'absolute';
    this.follower.style.top = targetBounds.top + window.scrollY - 1 + 'px';
    this.follower.style.right = (document.body.clientWidth - targetBounds.right) + window.scrollX - 1 + 'px';
  }
}

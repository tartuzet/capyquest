type ControlState = {
  left: boolean;
  right: boolean;
  jumpQueued: boolean;
};

export class MobileControls {
  private static state: ControlState = { left: false, right: false, jumpQueued: false };
  private static initialized = false;
  private static root?: HTMLDivElement;
  private static readonly isAndroidMobile = MobileControls.detectAndroidMobile();

  static isEnabled(): boolean {
    return this.isAndroidMobile;
  }

  static initialize(): void {
    if (!this.isAndroidMobile || this.initialized) {
      return;
    }

    const root = document.createElement('div');
    root.className = 'mobile-controls';
    root.innerHTML = `
      <div class="mobile-controls__left">
        <button type="button" class="mobile-controls__btn mobile-controls__btn--arrow" data-action="left">&#9664;</button>
        <button type="button" class="mobile-controls__btn mobile-controls__btn--arrow" data-action="right">&#9654;</button>
      </div>
      <div class="mobile-controls__right">
        <button type="button" class="mobile-controls__btn mobile-controls__btn--jump" data-action="jump"></button>
      </div>
    `;

    const bindDirectionalButton = (action: 'left' | 'right') => {
      const button = root.querySelector(`[data-action="${action}"]`) as HTMLButtonElement | null;
      if (!button) {
        return;
      }
      const setState = (pressed: boolean) => {
        this.state[action] = pressed;
      };
      button.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        setState(true);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach((eventName) => {
        button.addEventListener(eventName, () => setState(false));
      });
    };

    const jumpButton = root.querySelector('[data-action="jump"]') as HTMLButtonElement | null;
    if (jumpButton) {
      jumpButton.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        this.state.jumpQueued = true;
      });
    }

    bindDirectionalButton('left');
    bindDirectionalButton('right');
    document.body.appendChild(root);
    this.root = root;
    this.initialized = true;
  }

  static show(): void {
    if (!this.isAndroidMobile) {
      return;
    }
    this.initialize();
    this.root?.classList.add('mobile-controls--visible');
  }

  static hide(): void {
    this.root?.classList.remove('mobile-controls--visible');
    this.resetState();
  }

  static isLeftPressed(): boolean {
    return this.state.left;
  }

  static isRightPressed(): boolean {
    return this.state.right;
  }

  static consumeJumpPressed(): boolean {
    if (!this.state.jumpQueued) {
      return false;
    }
    this.state.jumpQueued = false;
    return true;
  }

  private static resetState(): void {
    this.state.left = false;
    this.state.right = false;
    this.state.jumpQueued = false;
  }

  private static detectAndroidMobile(): boolean {
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.includes('android');
    const isFireTv = ua.includes('aft') || ua.includes('fire tv') || ua.includes('firetv');
    return isAndroid && !isFireTv;
  }
}

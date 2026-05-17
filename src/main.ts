import Phaser from 'phaser';
import { gameConfig } from './game/config';
import { AudioManager } from './systems/AudioManager';
import { MobileControls } from './systems/MobileControls';

import './styles.css';

const tryLockLandscape = async (): Promise<void> => {
  if (!MobileControls.isEnabled()) {
    return;
  }

  const orientationApi = screen.orientation as ScreenOrientation & {
    lock?: (orientation: 'landscape' | 'landscape-primary' | 'landscape-secondary') => Promise<void>;
  };
  if (!orientationApi.lock) {
    return;
  }

  try {
    await orientationApi.lock('landscape');
  } catch {
    // Some Android WebViews require fullscreen/user gesture before lock works.
  }
};

const disableAndroidLongPressMenus = (): void => {
  if (!MobileControls.isEnabled()) {
    return;
  }

  const preventDefault = (event: Event) => event.preventDefault();
  document.addEventListener('contextmenu', preventDefault);
  document.addEventListener('selectstart', preventDefault);
};

const game = new Phaser.Game(gameConfig);
const audioManager = AudioManager.getInstance();

const pauseAudio = () => {
  audioManager.pauseAllAudio();
  game.sound.pauseAll();
};

const resumeAudio = () => {
  audioManager.resumeAllAudio();
  game.sound.resumeAll();
};

window.addEventListener('blur', pauseAudio);
window.addEventListener('focus', resumeAudio);
window.addEventListener('pagehide', pauseAudio);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    pauseAudio();
    return;
  }
  resumeAudio();
});

window.addEventListener('load', () => {
  disableAndroidLongPressMenus();
  void tryLockLandscape();
});

window.addEventListener('orientationchange', () => {
  void tryLockLandscape();
});

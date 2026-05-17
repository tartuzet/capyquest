import Phaser from 'phaser';
import { gameConfig } from './game/config';
import { AudioManager } from './systems/AudioManager';

import './styles.css';

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

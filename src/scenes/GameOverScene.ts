import Phaser from 'phaser';
import type { GameSceneData } from '../types';
import { MobileControls } from '../systems/MobileControls';

export class GameOverScene extends Phaser.Scene {
  private levelId = 1;
  private score = 0;
  private seeds = 0;

  constructor() {
    super('GameOverScene');
  }

  init(data: GameSceneData): void {
    this.levelId = data.levelId ?? 1;
    this.score = data.score ?? 0;
    this.seeds = data.seeds ?? 0;
  }

  create(): void {
    this.add.rectangle(480, 270, 960, 540, 0x2b171b);
    this.add.text(480, 180, 'Game Over', {
      fontFamily: 'Arial',
      fontSize: '54px',
      color: '#ff7777'
    }).setOrigin(0.5);
    this.add.text(480, 260, `Score: ${this.score} | Semillas: ${this.seeds}`, {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);
    const controlsText = MobileControls.isEnabled()
      ? 'Tocar boton para reintentar o ir al menu'
      : 'Enter: reintentar nivel | M: menu principal';
    this.add.text(480, 340, controlsText, {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.input.keyboard!.once('keydown-ENTER', () => {
      this.scene.start('GameScene', { levelId: this.levelId, lives: 3, score: this.score, seeds: this.seeds });
    });
    this.input.keyboard!.once('keydown-M', () => this.scene.start('MainMenuScene'));

    if (MobileControls.isEnabled()) {
      this.createTouchActions();
    }
  }

  private createTouchActions(): void {
    const retry = this.add.text(360, 430, 'Reintentar', {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#ffffff',
      backgroundColor: '#2f9e44',
      padding: { x: 18, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    retry.on('pointerdown', () => {
      this.scene.start('GameScene', { levelId: this.levelId, lives: 3, score: this.score, seeds: this.seeds });
    });

    const menu = this.add.text(600, 430, 'Menu', {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#ffffff',
      backgroundColor: '#3a4c66',
      padding: { x: 18, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    menu.on('pointerdown', () => this.scene.start('MainMenuScene'));
  }
}

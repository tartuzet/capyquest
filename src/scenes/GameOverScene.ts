import Phaser from 'phaser';
import type { GameSceneData } from '../types';

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
    this.add.text(480, 340, 'Enter: reintentar nivel | M: menu principal', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.input.keyboard!.once('keydown-ENTER', () => {
      this.scene.start('GameScene', { levelId: this.levelId, lives: 3, score: this.score, seeds: this.seeds });
    });
    this.input.keyboard!.once('keydown-M', () => this.scene.start('MainMenuScene'));
  }
}

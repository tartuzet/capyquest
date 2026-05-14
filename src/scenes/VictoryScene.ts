import Phaser from 'phaser';
import { AudioManager } from '../systems/AudioManager';
import type { GameSceneData } from '../types';

export class VictoryScene extends Phaser.Scene {
  private score = 0;
  private seeds = 0;

  constructor() {
    super('VictoryScene');
  }

  init(data: GameSceneData): void {
    this.score = data.score ?? 0;
    this.seeds = data.seeds ?? 0;
  }

  create(): void {
    const audio = AudioManager.getInstance();
    audio.stopMusic();
    audio.playVictory(this);

    this.add.rectangle(480, 270, 960, 540, 0x1f5e43);
    this.createConfetti();

    this.add.text(480, 130, 'Victoria', {
      fontFamily: 'Arial',
      fontSize: '54px',
      color: '#f5c542',
      stroke: '#17313b',
      strokeThickness: 5
    }).setOrigin(0.5);
    this.add.text(480, 210, 'Capi ha liberado el rio', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.add.text(480, 250, 'y recuperado las semillas doradas!', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.add.text(480, 310, `Score final: ${this.score} | Semillas: ${this.seeds}`, {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#f5c542'
    }).setOrigin(0.5);
    this.add.text(480, 400, 'Enter: selector de mundos | M: menu', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(480, 470, 'Gracias por jugar CapyQuest!', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#88cc88'
    }).setOrigin(0.5);

    this.input.keyboard!.once('keydown-ENTER', () => {
      this.scene.start('WorldSelectScene');
    });
    this.input.keyboard!.once('keydown-M', () => this.scene.start('MainMenuScene'));
  }

  private createConfetti(): void {
    const colors = [0xf5c542, 0xff6b6b, 0x4ecdc4, 0xffffff, 0x8bd450, 0x9b7bff];

    for (let i = 0; i < 95; i += 1) {
      const x = Phaser.Math.Between(20, 940);
      const y = Phaser.Math.Between(-160, -10);
      const confetti = this.add.rectangle(
        x,
        y,
        Phaser.Math.Between(5, 10),
        Phaser.Math.Between(8, 15),
        Phaser.Utils.Array.GetRandom(colors)
      );
      confetti.setAngle(Phaser.Math.Between(0, 180));
      confetti.setDepth(5);

      this.tweens.add({
        targets: confetti,
        x: x + Phaser.Math.Between(-90, 90),
        y: Phaser.Math.Between(560, 700),
        angle: confetti.angle + Phaser.Math.Between(180, 720),
        duration: Phaser.Math.Between(2600, 5200),
        delay: Phaser.Math.Between(0, 900),
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }
}

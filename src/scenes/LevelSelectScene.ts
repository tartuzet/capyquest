import Phaser from 'phaser';
import { levels } from '../levels/levelData';
import { AudioManager } from '../systems/AudioManager';

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelectScene');
  }

  create(): void {
    this.add.rectangle(480, 270, 960, 540, 0x21424f);
    this.add.text(480, 55, 'Seleccion de nivel', {
      fontFamily: 'Arial',
      fontSize: '34px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const world1Levels = levels.filter((l) => l.id <= 15);
    const world2Levels = levels.filter((l) => l.id >= 16);

    this.add.text(480, 90, 'Mundo 1: Rio y Pantano', {
      fontFamily: 'Arial', fontSize: '22px', color: '#9edb8b', stroke: '#1d2b2f', strokeThickness: 3
    }).setOrigin(0.5);

    world1Levels.forEach((level, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 260 + col * 420;
      const y = 120 + row * 70;
      this.createLevelButton(level, x, y);
    });

    this.add.text(480, 340, 'Mundo 2: Ruinas del Volcan', {
      fontFamily: 'Arial', fontSize: '22px', color: '#ff8844', stroke: '#2a1a0a', strokeThickness: 3
    }).setOrigin(0.5);

    world2Levels.forEach((level, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 260 + col * 420;
      const y = 370 + row * 70;
      this.createLevelButton(level, x, y);
    });

    this.add.text(480, 520, 'Click en un nivel. ESC vuelve al menu.', {
      fontFamily: 'Arial', fontSize: '18px', color: '#cdeff7'
    }).setOrigin(0.5);
    this.input.keyboard!.once('keydown-ESC', () => this.scene.start('MainMenuScene'));
  }

  private createLevelButton(level: { id: number; name: string }, x: number, y: number): void {
    const bgColor = level.id <= 15 ? '#2f9e44' : '#cc5500';
    const item = this.add.text(x, y, `${level.id}. ${level.name}`, {
      fontFamily: 'Arial', fontSize: '20px', color: '#ffffff',
      backgroundColor: bgColor, padding: { x: 12, y: 8 }
    }).setInteractive({ useHandCursor: true });

    item.on('pointerdown', () => {
      AudioManager.getInstance().startMusic(this);
      this.scene.start('GameScene', { levelId: level.id, lives: 3, score: 0, seeds: 0 });
    });
  }
}

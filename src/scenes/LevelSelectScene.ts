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

    levels.forEach((level, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 260 + col * 420;
      const y = 120 + row * 70;
      const item = this.add.text(x, y, `${level.id}. ${level.name}`, {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#ffffff',
        backgroundColor: '#2f9e44',
        padding: { x: 12, y: 8 }
      }).setInteractive({ useHandCursor: true });

      item.on('pointerdown', () => {
        AudioManager.getInstance().startMusic(this);
        this.scene.start('GameScene', { levelId: level.id, lives: 3, score: 0, seeds: 0 });
      });

      this.input.keyboard!.once(`keydown-${level.id}`, () => {
        AudioManager.getInstance().startMusic(this);
        this.scene.start('GameScene', { levelId: level.id, lives: 3, score: 0, seeds: 0 });
      });
    });

    this.add.text(480, 500, 'Click en un nivel o presiona 1-9. ESC vuelve al menu.', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#cdeff7'
    }).setOrigin(0.5);
    this.input.keyboard!.once('keydown-ESC', () => this.scene.start('MainMenuScene'));
  }
}

import Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create(): void {
    this.add.rectangle(480, 270, 960, 540, 0x76c7e8);
    this.add.rectangle(480, 500, 960, 90, 0x2f9e44);
    this.add.text(480, 150, 'CapyQuest: El Rio Perdido', {
      fontFamily: 'Arial',
      fontSize: '46px',
      color: '#ffffff',
      stroke: '#1d2b2f',
      strokeThickness: 6
    }).setOrigin(0.5);
    this.add.text(480, 250, 'Capi debe recuperar las semillas doradas y liberar el rio.', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#17313b'
    }).setOrigin(0.5);
    this.add.text(480, 335, 'Enter: seleccionar mundo | L: seleccionar nivel', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#1d2b2f',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.input.keyboard!.once('keydown-ENTER', () => {
      this.scene.start('WorldSelectScene');
    });
    this.input.keyboard!.once('keydown-L', () => this.scene.start('LevelSelectScene'));
  }
}

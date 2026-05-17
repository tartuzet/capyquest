import Phaser from 'phaser';
import { MobileControls } from '../systems/MobileControls';

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
    const controlsText = MobileControls.isEnabled()
      ? 'Tocar boton para iniciar'
      : 'Enter: seleccionar mundo | L: seleccionar nivel';
    this.add.text(480, 335, controlsText, {
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

    if (MobileControls.isEnabled()) {
      this.createTouchAction();
    }
  }

  private createTouchAction(): void {
    const start = this.add.text(480, 430, 'Jugar', {
      fontFamily: 'Arial',
      fontSize: '30px',
      color: '#ffffff',
      backgroundColor: '#2f9e44',
      padding: { x: 24, y: 12 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    start.on('pointerdown', () => this.scene.start('WorldSelectScene'));
  }
}

import Phaser from 'phaser';
import { AudioManager } from '../systems/AudioManager';

type WorldCard = {
  levelId: number;
  cardBg: Phaser.GameObjects.Rectangle;
  cardImage: Phaser.GameObjects.Image;
  overlay: Phaser.GameObjects.Rectangle;
};

export class WorldSelectScene extends Phaser.Scene {
  private worldCards: WorldCard[] = [];
  private selectedWorldIndex = 0;

  constructor() {
    super('WorldSelectScene');
  }

  create(): void {
    AudioManager.getInstance().stopMusic();
    this.worldCards = [];
    this.selectedWorldIndex = 0;

    this.add.rectangle(480, 270, 960, 540, 0x1f2f3a);
    this.add.text(480, 70, 'Selecciona un mundo', {
      fontFamily: 'Arial',
      fontSize: '40px',
      color: '#ffffff',
      stroke: '#0b1419',
      strokeThickness: 5
    }).setOrigin(0.5);

    this.addWorldCard(
      260,
      280,
      'world-1-card',
      16
    );

    this.addWorldCard(
      700,
      280,
      'world-2-card',
      1
    );

    this.add.text(480, 500, 'Flechas: cambiar mundo | Enter: entrar | ESC: menu', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#cdeff7'
    }).setOrigin(0.5);

    this.updateWorldSelectionVisuals();
    this.registerKeyboardControls();

    this.input.keyboard!.once('keydown-ESC', () => this.scene.start('MainMenuScene'));
  }

  private addWorldCard(
    x: number,
    y: number,
    textureKey: string,
    levelId: number
  ): void {
    const cardBg = this.add.rectangle(x, y, 360, 300, 0x0e161b, 1).setStrokeStyle(4, 0xffffff);
    const cardImage = this.add.image(x, y, textureKey).setDisplaySize(360, 300);
    const overlay = this.add.rectangle(x, y, 360, 300, 0x000000, 0.24);

    const worldIndex = this.worldCards.length;
    const activateCard = () => this.startWorld(worldIndex);
    const selectCard = () => this.setSelectedWorld(worldIndex);

    cardBg.setInteractive({ useHandCursor: true });
    cardBg.on('pointerover', selectCard);
    cardBg.on('pointerdown', activateCard);

    cardImage.setInteractive({ useHandCursor: true });
    cardImage.on('pointerover', selectCard);
    cardImage.on('pointerdown', activateCard);

    overlay.setInteractive({ useHandCursor: true });
    overlay.on('pointerover', selectCard);
    overlay.on('pointerdown', activateCard);

    this.worldCards.push({ levelId, cardBg, cardImage, overlay });
  }

  private registerKeyboardControls(): void {
    const keyboard = this.input.keyboard!;
    keyboard.enabled = true;
    keyboard.removeAllListeners();

    keyboard.on('keydown-LEFT', () => {
      this.setSelectedWorld((this.selectedWorldIndex - 1 + this.worldCards.length) % this.worldCards.length);
    });

    keyboard.on('keydown-RIGHT', () => {
      this.setSelectedWorld((this.selectedWorldIndex + 1) % this.worldCards.length);
    });

    keyboard.on('keydown-ENTER', () => this.startWorld(this.selectedWorldIndex));
  }

  private setSelectedWorld(index: number): void {
    this.selectedWorldIndex = index;
    this.updateWorldSelectionVisuals();
  }

  private updateWorldSelectionVisuals(): void {
    this.worldCards.forEach((card, index) => {
      const isSelected = index === this.selectedWorldIndex;
      card.cardBg.setStrokeStyle(isSelected ? 8 : 4, isSelected ? 0xffe066 : 0xffffff);
      const scale = isSelected ? 1.03 : 1;
      card.cardImage.setDisplaySize(360 * scale, 300 * scale);
      card.overlay.setFillStyle(0x000000, isSelected ? 0.12 : 0.24);
    });
  }

  private startWorld(index: number): void {
    const world = this.worldCards[index];
    if (!world) {
      return;
    }
    AudioManager.getInstance().startMusic(this);
    this.scene.start('GameScene', { levelId: world.levelId, lives: 3, score: 0, seeds: 0 });
  }
}

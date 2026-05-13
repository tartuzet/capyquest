import Phaser from 'phaser';

export interface HudState {
  level: number;
  lives: number;
  score: number;
  watermelons: number;
  totalWatermelons: number;
  seeds: number;
}

export class Hud {
  private panel: Phaser.GameObjects.Rectangle;
  private text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.panel = scene.add.rectangle(16, 12, 610, 38, 0x17313b, 0.62);
    this.panel.setOrigin(0, 0);
    this.panel.setScrollFactor(0);
    this.panel.setDepth(99);

    this.text = scene.add.text(28, 22, '', {
      fontFamily: 'Arial',
      fontSize: '17px',
      color: '#ffffff',
      stroke: '#1d2b2f',
      strokeThickness: 3
    });
    this.text.setScrollFactor(0);
    this.text.setDepth(100);
  }

  update(state: HudState): void {
    this.text.setText(
      `Nivel ${state.level}   Vidas: ${state.lives}   Score: ${state.score}   Sandias: ${state.watermelons}/${state.totalWatermelons}   Semillas: ${state.seeds}`
    );
    this.panel.width = Math.max(560, this.text.width + 28);
  }
}

import Phaser from 'phaser';
import type { RisingHazardConfig } from '../types';

export class RisingHazardSystem {
  private readonly scene: Phaser.Scene;
  private readonly config: RisingHazardConfig;
  private readonly sprite: Phaser.Physics.Arcade.Image;
  private readonly worldWidth: number;
  private active = true;
  private elapsedMs = 0;

  constructor(scene: Phaser.Scene, config: RisingHazardConfig, worldWidth: number, worldHeight: number) {
    this.scene = scene;
    this.config = config;
    this.worldWidth = worldWidth;

    this.sprite = scene.physics.add.image(worldWidth * 0.5, config.startY, config.type);
    this.sprite.setImmovable(true);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.allowGravity = false;
    this.sprite.setDisplaySize(worldWidth + 120, 170);
    this.sprite.setDepth(20);
    this.sprite.setData('type', config.type);
    this.sprite.setData('damageMode', config.damageMode ?? 'reset');

    if (config.type === 'lava') {
      scene.tweens.add({
        targets: this.sprite,
        alpha: 0.62,
        duration: 480,
        yoyo: true,
        repeat: -1
      });
    } else {
      scene.tweens.add({
        targets: this.sprite,
        alpha: 0.68,
        duration: 750,
        yoyo: true,
        repeat: -1
      });
    }
  }

  getHazard(): Phaser.Physics.Arcade.Image {
    return this.sprite;
  }

  update(deltaMs: number): void {
    if (!this.active || !this.sprite.active) {
      return;
    }

    this.elapsedMs += deltaMs;
    if (this.elapsedMs < (this.config.startDelayMs ?? 0)) {
      return;
    }

    const dt = deltaMs / 1000;
    const speed = this.config.maxSpeed
      ? Math.min(this.config.maxSpeed, this.config.speed + (this.scene.time.now / 1000) * 2.5)
      : this.config.speed;
    this.sprite.y -= speed * dt;
    this.sprite.x = this.worldWidth * 0.5;
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.updateFromGameObject();
  }

  pause(): void {
    this.active = false;
  }
}

import Phaser from 'phaser';
import type { CollectibleData } from '../types';

export class Collectible extends Phaser.Physics.Arcade.Sprite {
  readonly collectibleType: CollectibleData['type'];

  constructor(scene: Phaser.Scene, data: CollectibleData) {
    super(scene, data.x, data.y, data.type);

    this.collectibleType = data.type;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.allowGravity = false;
    this.setCircle(data.type === 'watermelon' ? 15 : 12);

    scene.tweens.add({
      targets: this,
      angle: 360,
      duration: data.type === 'watermelon' ? 1700 : 2200,
      repeat: -1,
      ease: 'Linear'
    });
    scene.tweens.add({
      targets: this,
      y: data.y - 6,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
}

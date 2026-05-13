import Phaser from 'phaser';
import type { EnemyData } from '../types';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private startX: number;
  private startY: number;
  private patrolDistance: number;
  private speed: number;
  private direction = 1;
  private kind: EnemyData['kind'];
  private phase: number;

  constructor(scene: Phaser.Scene, data: EnemyData) {
    super(scene, data.x, data.y, `enemy-${data.kind}`);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.kind = data.kind;
    this.startX = data.x;
    this.startY = data.y;
    this.patrolDistance = data.patrolDistance ?? 110;
    this.speed = data.speed ?? 55;
    this.phase = data.x * 0.01;
    this.setCollideWorldBounds(false);
    if (this.kind === 'frog') {
      this.setSize(38, 26);
      this.setOffset(7, 12);
    } else {
      this.setSize(34, 28);
      this.setOffset(3, 8);
    }

    if (this.kind === 'toucan' || this.kind === 'bat') {
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.allowGravity = false;
      body.setImmovable(true);
    }
  }

  update(time: number): void {
    if (this.kind === 'bat') {
      this.updateFlying(time, 34);
      return;
    } else if (this.kind === 'toucan') {
      this.updateFlying(time, 12);
      return;
    } else if (this.kind === 'frog') {
      this.setVelocityX(this.speed * this.direction);
      const body = this.body as Phaser.Physics.Arcade.Body;
      if (body.blocked.down && Math.sin(time / 500) > 0.97) {
        this.setVelocityY(-260);
      }
    } else {
      this.setVelocityX(this.speed * this.direction);
    }

    this.updateGroundPatrol();
  }

  private updateFlying(time: number, verticalRange: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const t = time / 1000;
    const travel = Math.sin(t * (this.speed / 42) + this.phase);
    const previousX = this.x;

    this.x = this.startX + travel * this.patrolDistance;
    this.y = this.startY + Math.sin(t * (this.speed / 28) + this.phase) * verticalRange;
    body.updateFromGameObject();
    this.setFlipX(this.x < previousX);
  }

  private updateGroundPatrol(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (
      Math.abs(this.x - this.startX) > this.patrolDistance
      || body.blocked.left
      || body.blocked.right
    ) {
      this.direction *= -1;
      this.setFlipX(this.direction < 0);
      this.x = Phaser.Math.Clamp(
        this.x,
        this.startX - this.patrolDistance,
        this.startX + this.patrolDistance
      );
    }
  }
}

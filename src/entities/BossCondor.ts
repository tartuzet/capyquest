import Phaser from 'phaser';

export class BossCondor extends Phaser.Physics.Arcade.Sprite {
  hp = 3;
  vulnerable = true;
  direction = -1;
  private speed = 140;
  private readonly minX = 100;
  private readonly maxX = 860;
  private startY: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'boss-condor');

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setSize(100, 50);
    this.setOffset(45, 35);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.allowGravity = false;
    body.setImmovable(true);
    this.startY = y;
  }

  update(time: number): void {
    if ((this.x <= this.minX && this.direction < 0)) {
      this.direction = 1;
      this.x = this.minX;
    } else if ((this.x >= this.maxX && this.direction > 0)) {
      this.direction = -1;
      this.x = this.maxX;
    }

    this.setFlipX(this.direction > 0);
    this.setVelocityX(this.speed * this.direction);
    this.y = this.startY + Math.sin(time / 600) * 25;
  }

  takeHit(): boolean {
    if (!this.vulnerable) {
      return false;
    }

    this.hp -= 1;
    this.vulnerable = false;
    this.setTint(0xfff08a);

    this.scene.time.delayedCall(900, () => {
      this.clearTint();
      this.vulnerable = true;
      this.speed += 20;
    });

    return this.hp <= 0;
  }
}
import Phaser from 'phaser';

export class BossJaguar extends Phaser.Physics.Arcade.Sprite {
  hp = 3;
  vulnerable = true;
  direction = -1;
  private speed = 130;
  private readonly minX = 200;
  private readonly maxX = 780;
  private jumpTimer = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'boss-jaguar');

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setSize(130, 60);
    this.setOffset(30, 25);
    this.setCollideWorldBounds(true);
    this.setBounce(0);
  }

  update(time: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    if ((this.x <= this.minX && this.direction < 0) || body.blocked.left) {
      this.direction = 1;
      this.x = this.minX;
    } else if ((this.x >= this.maxX && this.direction > 0) || body.blocked.right) {
      this.direction = -1;
      this.x = this.maxX;
    }

    this.setFlipX(this.direction > 0);
    this.setVelocityX(this.speed * this.direction);

    if (body.blocked.down && time > this.jumpTimer) {
      this.setVelocityY(-300 + Math.random() * 100);
      this.jumpTimer = time + 2000 + Math.random() * 1500;
    }
  }

  takeHit(): boolean {
    if (!this.vulnerable) {
      return false;
    }

    this.hp -= 1;
    this.vulnerable = false;
    this.setTint(0xfff08a);
    this.setVelocityX(this.speed * this.direction);

    this.scene.time.delayedCall(900, () => {
      this.clearTint();
      this.vulnerable = true;
      this.speed += 25;
    });

    return this.hp <= 0;
  }
}
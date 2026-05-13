import Phaser from 'phaser';

export class BossCrab extends Phaser.Physics.Arcade.Sprite {
  hp = 3;
  vulnerable = true;
  direction = -1;
  private speed = 100;
  private readonly minX = 200;
  private readonly maxX = 780;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'boss-crab');

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setSize(160, 80);
    this.setOffset(16, 30);
    this.setCollideWorldBounds(true);
  }

  update(): void {
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
      this.speed += 30;
    });

    return this.hp <= 0;
  }
}
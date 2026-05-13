import Phaser from 'phaser';

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors: CursorKeys;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;
  private keyW: Phaser.Input.Keyboard.Key;
  private moveSpeed = 230;
  private jumpSpeed = 470;
  private slowedUntil = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'capi-idle');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(false);
    this.setSize(50, 40);
    this.setOffset(12, 21);
    this.setDragX(900);

    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.keyA = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  }

  update(time: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const isLeftDown = this.cursors.left.isDown || this.keyA.isDown;
    const isRightDown = this.cursors.right.isDown || this.keyD.isDown;
    const isJumpDown = Phaser.Input.Keyboard.JustDown(this.cursors.space)
      || Phaser.Input.Keyboard.JustDown(this.cursors.up)
      || Phaser.Input.Keyboard.JustDown(this.keyW);
    const speed = time < this.slowedUntil ? this.moveSpeed * 0.55 : this.moveSpeed;

    if (isLeftDown) {
      this.setVelocityX(-speed);
      this.setFlipX(true);
    } else if (isRightDown) {
      this.setVelocityX(speed);
      this.setFlipX(false);
    }

    if (isJumpDown && body.blocked.down) {
      this.setVelocityY(-this.jumpSpeed);
      this.scene.events.emit('player-jump');
    }

    if (!body.blocked.down) {
      this.setTexture('capi-jump');
    } else if (Math.abs(body.velocity.x) > 10) {
      const runTexture = Math.floor(time / 140) % 2 === 0 ? 'capi-walk' : 'capi-run-2';
      this.setTexture(this.scene.textures.exists(runTexture) ? runTexture : 'capi-walk');
    } else {
      this.setTexture('capi-idle');
    }
  }

  applyMudSlow(time: number): void {
    this.slowedUntil = Math.max(this.slowedUntil, time + 180);
  }
}

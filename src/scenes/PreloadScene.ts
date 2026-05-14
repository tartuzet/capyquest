import Phaser from 'phaser';

const USE_EXTERNAL_PLAYER_SPRITES = false;

/*
  To replace the generated Capi placeholder with final PNG art, set
  USE_EXTERNAL_PLAYER_SPRITES to true and add these transparent PNG files:
  - public/assets/player/capi-idle.png
  - public/assets/player/capi-run-1.png
  - public/assets/player/capi-run-2.png
  - public/assets/player/capi-jump.png

  Suggested canvas size: 80x64 px, side-facing to the right, with feet near
  the bottom edge. Keep the visible character inside the canvas so the hitbox
  in Player.ts stays aligned.
*/
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload(): void {
    this.load.audio('bg-music', '/assets/audio/bg-music.mp3');
    this.load.audio('final-boss', '/assets/audio/final_boss.mp3');
    this.load.audio('intermediate-boss', '/assets/audio/final_boss.mp3');
    this.load.audio('volcano-theme', '/assets/audio/bg-music.mp3');
    this.load.audio('bonus-level', '/assets/audio/bonuslevel.mp3');
    this.load.audio('level-up', '/assets/audio/levelup.mp3');
    this.load.audio('capi-hit', '/assets/audio/capi_hit.mp3');
    this.load.audio('capi-jump', '/assets/audio/capi_jump.mp3');
    this.load.audio('boss-damage', '/assets/audio/damage.mp3');
    this.load.audio('boss-shoot', '/assets/audio/shoot.mp3');
    this.load.audio('victory', '/assets/audio/victory.mp3');
    this.load.image('world-1-card', '/world1.png');
    this.load.image('world-2-card', '/world2.png');

    if (!USE_EXTERNAL_PLAYER_SPRITES) {
      return;
    }

    this.load.image('capi-idle', '/assets/player/capi-idle.png');
    this.load.image('capi-walk', '/assets/player/capi-run-1.png');
    this.load.image('capi-run-2', '/assets/player/capi-run-2.png');
    this.load.image('capi-jump', '/assets/player/capi-jump.png');
  }

  create(): void {
    if (!USE_EXTERNAL_PLAYER_SPRITES) {
      this.createPlayerTextures();
    }
    this.createCollectibleTextures();
    this.createEnemyTextures();
    this.createWorldTextures();
    this.scene.start('WorldSelectScene');
  }

  private createPlayerTextures(): void {
    this.makeCapiTexture('capi-idle', {
      body: 0x9a6b43,
      scarf: 0xe84b3c,
      frontLegX: 59,
      backLegX: 18,
      earLift: 0,
      eyeY: 20,
      bodyLean: 0,
      jump: false
    });
    this.makeCapiTexture('capi-walk', {
      body: 0xa67449,
      scarf: 0xe84b3c,
      frontLegX: 63,
      backLegX: 14,
      earLift: 1,
      eyeY: 20,
      bodyLean: 2,
      jump: false
    });
    this.makeCapiTexture('capi-run-2', {
      body: 0xa67449,
      scarf: 0xe84b3c,
      frontLegX: 55,
      backLegX: 23,
      earLift: 1,
      eyeY: 20,
      bodyLean: -1,
      jump: false
    });
    this.makeCapiTexture('capi-jump', {
      body: 0x8d5f3b,
      scarf: 0xe84b3c,
      frontLegX: 58,
      backLegX: 20,
      earLift: 4,
      eyeY: 18,
      bodyLean: -2,
      jump: true
    });
  }

  private makeCapiTexture(
    key: string,
    options: {
      body: number;
      scarf: number;
      frontLegX: number;
      backLegX: number;
      earLift: number;
      eyeY: number;
      bodyLean: number;
      jump: boolean;
    }
  ): void {
    const g = this.add.graphics();
    const outline = 0x3a2417;
    const darkFur = 0x6b3f22;
    const muzzle = 0xd4a06a;

    g.fillStyle(0x000000, 0.16);
    g.fillEllipse(40, 58, 64, 9);

    g.lineStyle(3, outline, 1);
    g.fillStyle(options.body, 1);
    g.fillEllipse(31 + options.bodyLean, 36, 48, 36);
    g.strokeEllipse(31 + options.bodyLean, 36, 48, 36);

    g.lineStyle(2, 0x7a4b27, 0.6);
    g.lineBetween(14, 26, 22, 22);
    g.lineBetween(18, 31, 30, 27);
    g.lineBetween(16, 39, 29, 43);
    g.lineBetween(34, 25, 43, 22);
    g.lineBetween(37, 39, 48, 35);

    g.fillStyle(0xc78950, 1);
    g.fillEllipse(38, 23, 18, 7);
    g.fillStyle(0xf0c37f, 0.35);
    g.fillEllipse(24, 26, 20, 9);

    g.fillStyle(darkFur, 1);
    g.fillCircle(45, 10 - options.earLift, 8);
    g.fillCircle(58, 12 - options.earLift, 8);
    g.lineStyle(3, outline, 1);
    g.strokeCircle(45, 10 - options.earLift, 8);
    g.strokeCircle(58, 12 - options.earLift, 8);
    g.fillStyle(0xa06638, 1);
    g.fillCircle(46, 11 - options.earLift, 4);
    g.fillCircle(59, 13 - options.earLift, 4);

    g.lineStyle(3, outline, 1);
    g.fillStyle(0xb8793f, 1);
    g.fillEllipse(54, 28, 45, 36);
    g.strokeEllipse(54, 28, 45, 36);

    g.fillStyle(muzzle, 1);
    g.fillEllipse(65, 31, 25, 19);
    g.lineStyle(2, 0x764827, 1);
    g.strokeEllipse(65, 31, 25, 19);

    g.fillStyle(0x1c1410, 1);
    g.fillCircle(54, options.eyeY, 5);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(56, options.eyeY - 2, 2);
    g.lineStyle(3, 0x704321, 1);
    g.beginPath();
    g.arc(51, 16, 6, Phaser.Math.DegToRad(205), Phaser.Math.DegToRad(315));
    g.strokePath();

    g.fillStyle(0x3a2417, 1);
    g.fillEllipse(71, 29, 11, 7);
    g.fillStyle(0x6e4226, 1);
    g.fillCircle(68, 28, 2);
    g.fillCircle(74, 29, 2);
    g.lineStyle(2, 0x24150d, 1);
    g.lineBetween(70, 33, 69, 41);
    g.beginPath();
    g.arc(65, 39, 5, Phaser.Math.DegToRad(10), Phaser.Math.DegToRad(95));
    g.strokePath();

    g.lineStyle(3, 0x891f18, 1);
    g.fillStyle(options.scarf, 1);
    g.fillTriangle(45, 37, 62, 38, 50, 56);
    g.fillTriangle(42, 35, 26, 28, 39, 48);
    g.strokeTriangle(45, 37, 62, 38, 50, 56);
    g.strokeTriangle(42, 35, 26, 28, 39, 48);
    g.fillStyle(0xf15a46, 1);
    g.fillCircle(43, 36, 4);
    g.fillStyle(0xff7864, 0.45);
    g.fillTriangle(45, 40, 58, 41, 51, 50);

    const legY = options.jump ? 47 : 49;
    g.fillStyle(0x5a331d, 1);
    g.lineStyle(3, outline, 1);
    g.fillRoundedRect(options.backLegX, legY - (options.jump ? 5 : 0), 11, 12, 4);
    g.strokeRoundedRect(options.backLegX, legY - (options.jump ? 5 : 0), 11, 12, 4);
    g.fillRoundedRect(options.frontLegX, legY - (options.jump ? 3 : 0), 11, 12, 4);
    g.strokeRoundedRect(options.frontLegX, legY - (options.jump ? 3 : 0), 11, 12, 4);
    g.lineStyle(2, 0x24150d, 1);
    g.lineBetween(options.backLegX + 2, legY + 8, options.backLegX + 8, legY + 8);
    g.lineBetween(options.frontLegX + 2, legY + 8, options.frontLegX + 8, legY + 8);

    if (options.jump) {
      g.lineStyle(2, 0xffe0a3, 0.85);
      g.lineBetween(10, 52, 4, 58);
      g.lineBetween(70, 51, 78, 57);
    }

    g.generateTexture(key, 80, 64);
    g.destroy();
  }

  private createCollectibleTextures(): void {
    const watermelon = this.add.graphics();
    watermelon.fillStyle(0x000000, 0.16);
    watermelon.fillEllipse(24, 35, 32, 7);
    watermelon.lineStyle(3, 0x194c2a, 1);
    watermelon.fillStyle(0x2f9e44, 1);
    watermelon.slice(24, 25, 19, Phaser.Math.DegToRad(18), Phaser.Math.DegToRad(162), false);
    watermelon.fillPath();
    watermelon.strokePath();
    watermelon.lineStyle(3, 0x9bd66d, 1);
    watermelon.beginPath();
    watermelon.arc(24, 25, 15, Phaser.Math.DegToRad(22), Phaser.Math.DegToRad(158));
    watermelon.strokePath();
    watermelon.fillStyle(0xf05a66, 1);
    watermelon.fillTriangle(9, 25, 39, 25, 24, 38);
    watermelon.lineStyle(2, 0x8f2f37, 1);
    watermelon.lineBetween(9, 25, 39, 25);
    watermelon.fillStyle(0x231716, 1);
    watermelon.fillEllipse(20, 28, 3, 5);
    watermelon.fillEllipse(28, 28, 3, 5);
    watermelon.fillEllipse(24, 33, 3, 5);
    watermelon.fillStyle(0xffffff, 0.45);
    watermelon.fillEllipse(18, 20, 8, 4);
    watermelon.generateTexture('watermelon', 48, 42);
    watermelon.destroy();

    const seed = this.add.graphics();
    seed.fillStyle(0xf8df75, 0.28);
    seed.fillCircle(24, 24, 22);
    seed.fillStyle(0xf4c037, 1);
    seed.lineStyle(3, 0x7b5522, 1);
    const seedShape = [
      new Phaser.Geom.Point(24, 4),
      new Phaser.Geom.Point(36, 13),
      new Phaser.Geom.Point(39, 27),
      new Phaser.Geom.Point(31, 43),
      new Phaser.Geom.Point(23, 47),
      new Phaser.Geom.Point(14, 42),
      new Phaser.Geom.Point(8, 28),
      new Phaser.Geom.Point(12, 13)
    ];
    seed.fillPoints(seedShape, true);
    seed.strokePoints(seedShape, true);
    seed.lineStyle(2, 0xfff4b5, 1);
    seed.lineBetween(24, 10, 30, 24);
    seed.lineBetween(30, 24, 24, 38);
    seed.fillStyle(0xffffff, 0.55);
    seed.fillEllipse(19, 17, 8, 13);
    seed.fillStyle(0xfff8cc, 0.9);
    seed.fillCircle(36, 10, 3);
    seed.fillCircle(10, 34, 2);
    seed.generateTexture('golden-seed', 48, 50);
    seed.destroy();
  }

  private createEnemyTextures(): void {
    this.makeFrogTexture();
    this.makeCrabTexture();
    this.makeToucanTexture();
    this.makeBatTexture();
    this.makeSmallCaimanTexture();
    this.makeCaveBatTexture();
    this.makeIguanaTexture();
    this.makeRockBeetleTexture();
    this.makeTotemTexture();
    this.makeSnakeTexture();
    this.makeFireBirdTexture();
    this.makeBossTexture();
    this.makeBossCrabTexture();
    this.makeBossFrogTexture();
    this.makeBossJaguarTexture();
    this.makeBossCondorTexture();
  }

  private makeFrogTexture(): void {
    const frog = this.add.graphics();
    frog.fillStyle(0x000000, 0.18);
    frog.fillEllipse(30, 39, 45, 8);
    frog.lineStyle(3, 0x173b1f, 1);
    frog.fillStyle(0x4fbd55, 1);
    frog.fillEllipse(30, 27, 45, 30);
    frog.strokeEllipse(30, 27, 45, 30);
    frog.fillStyle(0x79d86d, 1);
    frog.fillEllipse(19, 15, 17, 17);
    frog.fillEllipse(41, 15, 17, 17);
    frog.lineStyle(2, 0x173b1f, 1);
    frog.strokeEllipse(19, 15, 17, 17);
    frog.strokeEllipse(41, 15, 17, 17);
    frog.fillStyle(0xffffff, 1);
    frog.fillCircle(19, 14, 6);
    frog.fillCircle(41, 14, 6);
    frog.fillStyle(0x101710, 1);
    frog.fillCircle(21, 15, 3);
    frog.fillCircle(39, 15, 3);
    frog.lineStyle(3, 0x173b1f, 1);
    frog.lineBetween(13, 7, 23, 11);
    frog.lineBetween(47, 7, 37, 11);
    frog.fillStyle(0x8ae17e, 1);
    frog.fillEllipse(12, 34, 19, 10);
    frog.fillEllipse(48, 34, 19, 10);
    frog.lineStyle(2, 0x173b1f, 1);
    frog.strokeEllipse(12, 34, 19, 10);
    frog.strokeEllipse(48, 34, 19, 10);
    frog.lineStyle(2, 0x173b1f, 1);
    frog.beginPath();
    frog.arc(30, 25, 11, 0.25, 2.9);
    frog.strokePath();
    frog.fillStyle(0xf28f8f, 0.75);
    frog.fillCircle(14, 25, 3);
    frog.fillCircle(46, 25, 3);
    frog.generateTexture('enemy-frog', 60, 46);
    frog.destroy();
  }

  private makeCrabTexture(): void {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.18);
    g.fillEllipse(26, 32, 42, 7);
    g.lineStyle(3, 0x6a2018, 1);
    g.fillStyle(0xd95a3e, 1);
    g.fillEllipse(26, 24, 34, 23);
    g.strokeEllipse(26, 24, 34, 23);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(20, 17, 4);
    g.fillCircle(32, 17, 4);
    g.fillStyle(0x211413, 1);
    g.fillCircle(20, 17, 2);
    g.fillCircle(32, 17, 2);
    g.lineStyle(3, 0x6a2018, 1);
    g.lineBetween(10, 23, 2, 17);
    g.lineBetween(42, 23, 50, 17);
    g.fillStyle(0xf07a55, 1);
    g.fillCircle(3, 16, 5);
    g.fillCircle(49, 16, 5);
    g.lineStyle(2, 0x6a2018, 1);
    g.lineBetween(12, 33, 6, 38);
    g.lineBetween(23, 35, 19, 40);
    g.lineBetween(31, 35, 35, 40);
    g.lineBetween(40, 33, 46, 38);
    g.generateTexture('enemy-crab', 52, 42);
    g.destroy();
  }

  private makeToucanTexture(): void {
    const g = this.add.graphics();
    g.lineStyle(3, 0x18242b, 1);
    g.fillStyle(0x253545, 1);
    g.fillEllipse(23, 22, 32, 24);
    g.strokeEllipse(23, 22, 32, 24);
    g.fillStyle(0xffc94a, 1);
    g.fillEllipse(43, 19, 27, 12);
    g.lineStyle(2, 0x8d5620, 1);
    g.strokeEllipse(43, 19, 27, 12);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(28, 16, 4);
    g.fillStyle(0x101010, 1);
    g.fillCircle(29, 16, 2);
    g.fillStyle(0x7accc8, 1);
    g.fillTriangle(12, 25, 2, 16, 6, 30);
    g.generateTexture('enemy-toucan', 58, 38);
    g.destroy();
  }

  private makeBatTexture(): void {
    const g = this.add.graphics();
    g.lineStyle(3, 0x1b1720, 1);
    g.fillStyle(0x4d3d5c, 1);
    g.fillTriangle(23, 21, 1, 8, 10, 31);
    g.fillTriangle(25, 21, 49, 8, 40, 31);
    g.fillEllipse(25, 22, 24, 19);
    g.strokeEllipse(25, 22, 24, 19);
    g.fillStyle(0xbfa7d7, 1);
    g.fillTriangle(18, 13, 21, 5, 24, 14);
    g.fillTriangle(27, 14, 31, 5, 33, 14);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(21, 20, 3);
    g.fillCircle(29, 20, 3);
    g.fillStyle(0x111111, 1);
    g.fillCircle(21, 20, 1.5);
    g.fillCircle(29, 20, 1.5);
    g.generateTexture('enemy-bat', 50, 38);
    g.destroy();
  }

  private makeSmallCaimanTexture(): void {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.18);
    g.fillEllipse(30, 34, 52, 7);
    g.lineStyle(3, 0x173b1f, 1);
    g.fillStyle(0x3f9b45, 1);
    g.fillRoundedRect(6, 15, 45, 20, 8);
    g.strokeRoundedRect(6, 15, 45, 20, 8);
    g.fillStyle(0x77c765, 1);
    g.fillRoundedRect(22, 20, 35, 13, 6);
    g.lineStyle(2, 0x173b1f, 1);
    g.strokeRoundedRect(22, 20, 35, 13, 6);
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(33, 31, 36, 25, 39, 31);
    g.fillTriangle(43, 31, 46, 25, 49, 31);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(18, 14, 4);
    g.fillStyle(0x111111, 1);
    g.fillCircle(19, 14, 2);
    g.generateTexture('enemy-small-caiman', 62, 42);
    g.destroy();
  }

  private makeCaveBatTexture(): void {
    const g = this.add.graphics();
    g.lineStyle(3, 0x0e0a14, 1);
    g.fillStyle(0x2a1a3a, 1);
    g.fillTriangle(23, 21, 1, 8, 10, 31);
    g.fillTriangle(25, 21, 49, 8, 40, 31);
    g.fillEllipse(25, 22, 24, 19);
    g.strokeEllipse(25, 22, 24, 19);
    g.fillStyle(0x8a3a3a, 1);
    g.fillTriangle(18, 13, 21, 5, 24, 14);
    g.fillTriangle(27, 14, 31, 5, 33, 14);
    g.fillStyle(0xff4444, 1);
    g.fillCircle(21, 20, 3);
    g.fillCircle(29, 20, 3);
    g.fillStyle(0x000000, 1);
    g.fillCircle(21, 20, 2);
    g.fillCircle(29, 20, 2);
    g.generateTexture('enemy-cave-bat', 50, 38);
    g.destroy();
  }

  private makeIguanaTexture(): void {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.18);
    g.fillEllipse(30, 34, 50, 7);
    g.lineStyle(3, 0x1a3a1a, 1);
    g.fillStyle(0x3a8a3a, 1);
    g.fillRoundedRect(4, 18, 44, 20, 6);
    g.strokeRoundedRect(4, 18, 44, 20, 6);
    g.fillStyle(0x5aba5a, 1);
    g.fillRoundedRect(16, 22, 34, 14, 5);
    g.lineStyle(2, 0x1a3a1a, 1);
    g.strokeRoundedRect(16, 22, 34, 14, 5);
    g.fillStyle(0xffcc00, 1);
    g.fillCircle(14, 16, 4);
    g.fillStyle(0x111111, 1);
    g.fillCircle(15, 16, 2);
    g.fillStyle(0x3a8a3a, 1);
    g.fillTriangle(48, 22, 56, 26, 48, 32);
    g.lineStyle(2, 0x1a3a1a, 1);
    g.strokeTriangle(48, 22, 56, 26, 48, 32);
    g.lineStyle(2, 0x1a3a1a, 1);
    g.lineBetween(8, 36, 4, 42);
    g.lineBetween(18, 38, 14, 44);
    g.lineBetween(30, 38, 30, 44);
    g.lineBetween(42, 38, 46, 44);
    g.generateTexture('enemy-iguana', 58, 46);
    g.destroy();
  }

  private makeRockBeetleTexture(): void {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.18);
    g.fillEllipse(28, 32, 46, 7);
    g.lineStyle(3, 0x2a1a0a, 1);
    g.fillStyle(0x6a4a2a, 1);
    g.fillEllipse(28, 24, 40, 24);
    g.strokeEllipse(28, 24, 40, 24);
    g.fillStyle(0x4a3018, 1);
    g.fillEllipse(28, 22, 34, 18);
    g.lineStyle(2, 0x2a1a0a, 1);
    g.strokeEllipse(28, 22, 34, 18);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(18, 16, 4);
    g.fillCircle(38, 16, 4);
    g.fillStyle(0x111111, 1);
    g.fillCircle(18, 16, 2);
    g.fillCircle(38, 16, 2);
    g.lineStyle(2, 0x2a1a0a, 1);
    g.lineBetween(8, 32, 2, 36);
    g.lineBetween(48, 32, 54, 36);
    g.lineBetween(14, 34, 10, 40);
    g.lineBetween(42, 34, 46, 40);
    g.generateTexture('enemy-rock-beetle', 56, 42);
    g.destroy();
  }

  private makeTotemTexture(): void {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.18);
    g.fillEllipse(24, 46, 42, 7);
    g.lineStyle(3, 0x3a2a1a, 1);
    g.fillStyle(0x6a4a2a, 1);
    g.fillRoundedRect(6, 8, 36, 34, 6);
    g.strokeRoundedRect(6, 8, 36, 34, 6);
    g.fillStyle(0x8a6a3a, 1);
    g.fillRoundedRect(10, 14, 28, 20, 4);
    g.fillStyle(0xc44a2e, 1);
    g.fillCircle(24, 18, 5);
    g.fillStyle(0xffcc00, 1);
    g.fillCircle(20, 16, 2);
    g.fillCircle(28, 16, 2);
    g.fillStyle(0x111111, 1);
    g.fillCircle(20, 16, 1);
    g.fillCircle(28, 16, 1);
    g.lineStyle(2, 0x3a2a1a, 1);
    g.lineBetween(14, 30, 20, 28);
    g.lineBetween(34, 30, 28, 28);
    g.generateTexture('enemy-totem', 48, 50);
    g.destroy();
  }

  private makeSnakeTexture(): void {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.18);
    g.fillEllipse(30, 24, 50, 6);
    g.lineStyle(3, 0x1a3a1a, 1);
    g.fillStyle(0x4a8a3a, 1);
    g.fillRoundedRect(2, 8, 48, 14, 6);
    g.strokeRoundedRect(2, 8, 48, 14, 6);
    g.fillStyle(0x6aba4a, 1);
    g.fillRoundedRect(8, 10, 36, 10, 5);
    g.fillStyle(0xff4444, 1);
    g.fillTriangle(48, 12, 56, 15, 48, 20);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(10, 12, 3);
    g.fillStyle(0x111111, 1);
    g.fillCircle(10, 12, 1.5);
    g.fillStyle(0xff4444, 1);
    g.fillCircle(8, 10, 1);
    g.generateTexture('enemy-snake', 56, 30);
    g.destroy();
  }

  private makeFireBirdTexture(): void {
    const g = this.add.graphics();
    g.lineStyle(3, 0x4a1500, 1);
    g.fillStyle(0xcc4400, 1);
    g.fillEllipse(28, 22, 40, 28);
    g.strokeEllipse(28, 22, 40, 28);
    g.fillStyle(0xff6600, 1);
    g.fillEllipse(22, 18, 24, 18);
    g.fillStyle(0xffcc00, 1);
    g.fillEllipse(44, 20, 22, 12);
    g.lineStyle(2, 0x8a2a00, 1);
    g.strokeEllipse(44, 20, 22, 12);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(22, 16, 4);
    g.fillStyle(0x111111, 1);
    g.fillCircle(23, 16, 2);
    g.fillStyle(0xffcc00, 1);
    g.fillTriangle(12, 24, 0, 16, 6, 30);
    g.generateTexture('enemy-fire-bird', 56, 38);
    g.destroy();
  }

  private makeBossTexture(): void {
    const g = this.add.graphics();
    const outline = 0x172414;
    const darkGreen = 0x2c3f22;
    const swampGreen = 0x4a6130;
    const midGreen = 0x64763a;
    const belly = 0xb4a960;

    g.fillStyle(0x000000, 0.22);
    g.fillEllipse(96, 85, 162, 13);

    g.lineStyle(4, outline, 1);
    g.fillStyle(swampGreen, 1);
    g.fillEllipse(94, 50, 112, 54);
    g.strokeEllipse(94, 50, 112, 54);

    g.fillStyle(darkGreen, 1);
    g.fillTriangle(132, 47, 188, 28, 178, 73);
    g.lineStyle(4, outline, 1);
    g.strokeTriangle(132, 47, 188, 28, 178, 73);
    g.fillStyle(midGreen, 1);
    g.fillTriangle(150, 50, 181, 37, 176, 65);

    g.lineStyle(4, outline, 1);
    g.fillStyle(swampGreen, 1);
    g.fillRoundedRect(16, 33, 78, 28, 13);
    g.strokeRoundedRect(16, 33, 78, 28, 13);
    g.fillStyle(0x3b512a, 1);
    g.fillRoundedRect(10, 26, 63, 21, 12);
    g.strokeRoundedRect(10, 26, 63, 21, 12);

    g.fillStyle(belly, 1);
    g.fillEllipse(63, 61, 80, 27);
    g.fillEllipse(37, 50, 48, 17);
    g.lineStyle(2, 0x786f36, 1);
    g.beginPath();
    g.arc(66, 60, 35, Phaser.Math.DegToRad(8), Phaser.Math.DegToRad(169));
    g.strokePath();

    g.fillStyle(0x202815, 1);
    const plates = [
      [48, 20, 10], [66, 15, 12], [86, 12, 12], [108, 15, 12],
      [128, 22, 10], [148, 32, 9], [166, 42, 8]
    ];
    plates.forEach(([x, y, size]) => {
      g.fillTriangle(x - size, y + 7, x, y - size, x + size, y + 7);
      g.lineStyle(2, outline, 1);
      g.strokeTriangle(x - size, y + 7, x, y - size, x + size, y + 7);
    });

    g.fillStyle(0x6f7a3e, 1);
    for (const [x, y, w, h] of [
      [65, 37, 10, 6], [88, 31, 12, 7], [110, 42, 10, 6], [132, 52, 12, 7],
      [80, 55, 8, 5], [121, 33, 9, 5], [145, 61, 8, 5]
    ]) {
      g.fillEllipse(x, y, w, h);
    }

    g.lineStyle(4, outline, 1);
    g.fillStyle(0x53672f, 1);
    g.fillEllipse(48, 29, 42, 25);
    g.strokeEllipse(48, 29, 42, 25);
    g.fillStyle(0x233018, 1);
    g.fillEllipse(32, 31, 22, 10);
    g.fillEllipse(52, 28, 18, 8);
    g.fillStyle(0xe9b935, 1);
    g.fillEllipse(49, 29, 13, 8);
    g.fillStyle(0x111111, 1);
    g.fillEllipse(51, 29, 4, 7);
    g.lineStyle(4, outline, 1);
    g.lineBetween(39, 21, 58, 25);

    g.fillStyle(0x14120e, 1);
    g.fillEllipse(20, 37, 6, 4);
    g.fillEllipse(34, 37, 6, 4);
    g.lineStyle(3, outline, 1);
    g.lineBetween(12, 47, 74, 52);

    g.fillStyle(0xfff2c0, 1);
    for (let x = 19; x < 75; x += 10) {
      g.fillTriangle(x, 49, x + 4, 59, x + 8, 50);
    }
    for (let x = 24; x < 69; x += 12) {
      g.fillTriangle(x, 45, x + 4, 37, x + 8, 46);
    }

    g.lineStyle(3, 0x74833c, 1);
    g.lineBetween(22, 56, 20, 70);
    g.lineBetween(51, 58, 49, 77);
    g.lineBetween(142, 62, 144, 78);
    g.fillStyle(0x74833c, 1);
    g.fillEllipse(20, 71, 4, 8);
    g.fillEllipse(49, 78, 5, 9);
    g.fillEllipse(144, 79, 4, 8);

    this.drawBossLeg(g, 62, 66, outline);
    this.drawBossLeg(g, 109, 67, outline);
    this.drawBossLeg(g, 139, 66, outline);

    g.lineStyle(3, 0x7a2d23, 1);
    g.lineBetween(120, 24, 137, 16);
    g.lineBetween(122, 29, 141, 21);
    g.fillStyle(0x5b3b24, 1);
    g.fillTriangle(130, 21, 148, 11, 143, 31);

    g.generateTexture('boss-caiman', 192, 96);
    g.destroy();
  }

  private makeBossCrabTexture(): void {
    const g = this.add.graphics();
    const outline = 0x4a150d;
    const shell = 0xc44a2e;
    const shellDark = 0x8a2e1c;
    const shellLight = 0xe86842;
    const claw = 0xd95a3e;
    const clawDark = 0x8a2012;

    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(96, 110, 170, 14);

    g.fillStyle(shellDark, 1);
    g.fillEllipse(96, 75, 110, 60);
    g.lineStyle(4, outline, 1);
    g.fillStyle(shell, 1);
    g.fillEllipse(96, 70, 100, 50);
    g.strokeEllipse(96, 70, 100, 50);

    g.fillStyle(shellLight, 1);
    g.fillEllipse(70, 60, 40, 25);
    g.fillEllipse(120, 60, 40, 25);
    g.lineStyle(3, outline, 1);
    g.strokeEllipse(70, 60, 40, 25);
    g.strokeEllipse(120, 60, 40, 25);

    g.fillStyle(0xffffff, 1);
    g.fillCircle(75, 50, 10);
    g.fillCircle(115, 50, 10);
    g.fillStyle(0x111111, 1);
    g.fillCircle(75, 50, 5);
    g.fillCircle(115, 50, 5);
    g.fillStyle(0xff4444, 1);
    g.fillCircle(77, 48, 2);
    g.fillCircle(117, 48, 2);

    g.lineStyle(3, outline, 1);
    g.fillStyle(clawDark, 1);
    this.drawCrabClaw(g, 30, 75, -1, outline, claw);
    this.drawCrabClaw(g, 162, 75, 1, outline, claw);

    g.fillStyle(0x3a150d, 1);
    g.fillEllipse(50, 95, 18, 10);
    g.fillEllipse(142, 95, 18, 10);
    g.fillEllipse(80, 100, 18, 10);
    g.fillEllipse(112, 100, 18, 10);

    g.lineStyle(3, outline, 1);
    g.fillStyle(shellDark, 1);
    this.drawCrabLeg(g, 50, 95, -1);
    this.drawCrabLeg(g, 142, 95, 1);
    this.drawCrabLeg(g, 65, 100, -1);
    this.drawCrabLeg(g, 127, 100, 1);

    g.fillStyle(0x1a0a05, 1);
    g.fillEllipse(96, 95, 60, 8);
    g.fillStyle(0xfff2c0, 1);
    for (let x = 70; x < 125; x += 8) {
      g.fillTriangle(x, 91, x + 3, 99, x + 6, 92);
    }

    g.generateTexture('boss-crab', 192, 120);
    g.destroy();
  }

  private drawCrabClaw(g: Phaser.GameObjects.Graphics, x: number, y: number, direction: number, outline: number, claw: number): void {
    g.lineStyle(4, outline, 1);
    g.fillStyle(claw, 1);
    g.fillEllipse(x, y, 45, 30);
    g.strokeEllipse(x, y, 45, 30);

    g.fillStyle(claw, 1);
    g.fillTriangle(x - 20 * direction, y - 10, x - 35 * direction, y - 35, x - 25 * direction, y + 5);
    g.strokeTriangle(x - 20 * direction, y - 10, x - 35 * direction, y - 35, x - 25 * direction, y + 5);

    g.fillStyle(0x8a2012, 1);
    g.fillTriangle(x - 15 * direction, y - 8, x - 30 * direction, y - 25, x - 20 * direction, y);
    g.strokeTriangle(x - 15 * direction, y - 8, x - 30 * direction, y - 25, x - 20 * direction, y);
  }

  private drawCrabLeg(g: Phaser.GameObjects.Graphics, x: number, y: number, direction: number): void {
    g.lineStyle(3, 0x4a150d, 1);
    g.fillStyle(0x8a2e1c, 1);
    g.fillRoundedRect(x - 5, y - 4, 12, 10, 3);
    g.strokeRoundedRect(x - 5, y - 4, 12, 10, 3);
    g.lineBetween(x, y + 5, x + 10 * direction, y + 15);
  }

  private makeBossFrogTexture(): void {
    const g = this.add.graphics();
    const outline = 0x0d2f0d;
    const body = 0x4fbd55;
    const bodyLight = 0x79d86d;
    const belly = 0x8ae17e;

    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(96, 110, 170, 14);

    g.lineStyle(4, outline, 1);
    g.fillStyle(body, 1);
    g.fillEllipse(96, 75, 110, 65);
    g.strokeEllipse(96, 75, 110, 65);

    g.fillStyle(bodyLight, 1);
    g.fillEllipse(55, 58, 45, 45);
    g.fillEllipse(137, 58, 45, 45);
    g.lineStyle(3, outline, 1);
    g.strokeEllipse(55, 58, 45, 45);
    g.strokeEllipse(137, 58, 45, 45);

    g.fillStyle(0xffffff, 1);
    g.fillCircle(55, 55, 12);
    g.fillCircle(137, 55, 12);
    g.fillStyle(0x101710, 1);
    g.fillCircle(58, 57, 6);
    g.fillCircle(134, 57, 6);

    g.lineStyle(4, outline, 1);
    g.lineBetween(31, 40, 55, 47);
    g.lineBetween(161, 40, 137, 47);

    g.fillStyle(0xc44a6e, 1);
    g.fillEllipse(96, 95, 90, 14);
    g.lineStyle(3, 0x8a2e4a, 1);
    g.fillEllipse(96, 92, 80, 10);
    g.strokeEllipse(96, 92, 80, 10);
    g.fillEllipse(96, 98, 50, 8);

    g.fillStyle(belly, 1);
    g.fillEllipse(96, 88, 70, 12);
    g.lineStyle(2, 0x3a6b3a, 1);
    g.beginPath();
    g.arc(96, 88, 35, Phaser.Math.DegToRad(5), Phaser.Math.DegToRad(175));
    g.strokePath();

    g.fillStyle(0x173b1f, 1);
    g.fillEllipse(50, 108, 40, 14);
    g.fillEllipse(142, 108, 40, 14);
    g.fillEllipse(70, 112, 40, 14);
    g.fillEllipse(122, 112, 40, 14);

    g.lineStyle(3, outline, 1);
    g.fillStyle(bodyLight, 1);
    this.drawBossFrogLeg(g, 50, 108, -1);
    this.drawBossFrogLeg(g, 142, 108, 1);
    this.drawBossFrogLeg(g, 70, 112, -1);
    this.drawBossFrogLeg(g, 122, 112, 1);

    g.fillStyle(0xf28f8f, 0.75);
    g.fillCircle(42, 70, 6);
    g.fillCircle(150, 70, 6);

    g.generateTexture('boss-frog', 192, 120);
    g.destroy();
  }

  private drawBossFrogLeg(g: Phaser.GameObjects.Graphics, x: number, y: number, direction: number): void {
    g.lineStyle(3, 0x0d2f0d, 1);
    g.fillStyle(0x79d86d, 1);
    g.fillRoundedRect(x - 8, y - 6, 18, 14, 6);
    g.strokeRoundedRect(x - 8, y - 6, 18, 14, 6);
    g.lineBetween(x + 2, y + 7, x + 12 * direction, y + 18);
    g.lineBetween(x - 2, y + 7, x + 8 * direction, y + 16);
  }

  private makeBossJaguarTexture(): void {
    const g = this.add.graphics();
    const outline = 0x0a0a0a;
    const body = 0x1a1a2a;
    const spots = 0xcc4400;

    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(96, 90, 170, 14);

    g.lineStyle(4, outline, 1);
    g.fillStyle(body, 1);
    g.fillEllipse(96, 62, 120, 52);
    g.strokeEllipse(96, 62, 120, 52);

    g.fillStyle(body, 1);
    g.fillEllipse(140, 60, 60, 40);
    g.strokeEllipse(140, 60, 60, 40);

    g.fillStyle(0xffcc00, 1);
    g.fillCircle(155, 48, 8);
    g.fillStyle(0x111111, 1);
    g.fillCircle(157, 48, 4);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(158, 46, 2);

    g.fillStyle(spots, 1);
    const spotPositions = [
      [70, 55, 6], [90, 48, 8], [108, 52, 6],
      [80, 72, 5], [100, 68, 7], [120, 60, 5]
    ];
    spotPositions.forEach(([sx, sy, size]) => {
      g.fillCircle(sx, sy, size);
    });

    g.lineStyle(3, outline, 1);
    g.fillStyle(body, 1);
    this.drawJaguarLeg(g, 60, 78);
    this.drawJaguarLeg(g, 85, 80);
    this.drawJaguarLeg(g, 110, 80);
    this.drawJaguarLeg(g, 130, 78);

    g.lineStyle(3, outline, 1);
    g.lineBetween(148, 64, 178, 70);
    g.lineBetween(146, 70, 176, 76);
    g.lineBetween(148, 76, 174, 82);

    g.generateTexture('boss-jaguar', 192, 96);
    g.destroy();
  }

  private makeBossCondorTexture(): void {
    const g = this.add.graphics();
    const outline = 0x4a1500;
    const body = 0xcc3300;
    const wing = 0x884400;
    const belly = 0xff8844;

    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(96, 95, 170, 14);

    g.lineStyle(4, outline, 1);
    g.fillStyle(body, 1);
    g.fillEllipse(96, 65, 90, 50);
    g.strokeEllipse(96, 65, 90, 50);

    g.fillStyle(wing, 1);
    g.fillTriangle(20, 20, 60, 55, 10, 60);
    g.strokeTriangle(20, 20, 60, 55, 10, 60);
    g.fillTriangle(172, 20, 132, 55, 182, 60);
    g.strokeTriangle(172, 20, 132, 55, 182, 60);

    g.fillStyle(belly, 1);
    g.fillEllipse(96, 78, 60, 24);

    g.fillStyle(0xffcc00, 1);
    g.fillCircle(60, 50, 8);
    g.fillCircle(132, 50, 8);
    g.fillStyle(0x111111, 1);
    g.fillCircle(60, 50, 4);
    g.fillCircle(132, 50, 4);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(61, 48, 2);
    g.fillCircle(133, 48, 2);

    g.lineStyle(4, outline, 1);
    g.fillStyle(0xffaa00, 1);
    g.fillTriangle(90, 88, 96, 100, 102, 88);
    g.strokeTriangle(90, 88, 96, 100, 102, 88);

    g.lineStyle(3, outline, 1);
    g.lineBetween(88, 88, 70, 82);
    g.lineBetween(104, 88, 122, 82);
    g.lineBetween(92, 100, 80, 108);
    g.lineBetween(100, 100, 112, 108);

    g.generateTexture('boss-condor', 192, 110);
    g.destroy();
  }

  private drawJaguarLeg(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
    g.lineStyle(3, 0x0a0a0a, 1);
    g.fillStyle(0x1a1a2a, 1);
    g.fillRoundedRect(x - 6, y - 6, 14, 12, 5);
    g.strokeRoundedRect(x - 6, y - 6, 14, 12, 5);
  }

  private drawBossLeg(g: Phaser.GameObjects.Graphics, x: number, y: number, outline: number): void {
    g.lineStyle(4, outline, 1);
    g.fillStyle(0x324621, 1);
    g.fillRoundedRect(x - 12, y - 12, 22, 18, 7);
    g.strokeRoundedRect(x - 12, y - 12, 22, 18, 7);
    g.fillStyle(0x2b2418, 1);
    g.fillTriangle(x - 9, y + 3, x - 5, y + 12, x, y + 4);
    g.fillTriangle(x, y + 4, x + 5, y + 12, x + 9, y + 3);
  }

  private makeFireballTexture(): void {
    const g = this.add.graphics();
    g.fillStyle(0xff4400, 1);
    g.fillCircle(12, 12, 12);
    g.fillStyle(0xff8800, 1);
    g.fillCircle(10, 10, 8);
    g.fillStyle(0xffcc00, 1);
    g.fillCircle(8, 8, 4);
    g.fillStyle(0xffaa00, 0.5);
    g.fillCircle(14, 14, 6);
    g.generateTexture('fireball', 24, 24);
    g.destroy();
  }

  private createWorldTextures(): void {
    this.makePlatformTexture('platform', 0x7b4f2a, 0x35a853, 0x5b351f, false, false);
    this.makePlatformTexture('moving-platform', 0x8b5b32, 0x58b9cf, 0x5a3d2b, true, false);
    this.makePlatformTexture('disappearing-platform', 0x6f5b35, 0xa4d65e, 0x4e4328, false, true);
    this.makePlatformTexture('breakable-platform', 0x7a4a2a, 0x8a6a3a, 0x4a2a18, false, true);
    this.makeMudTexture();
    this.makeWaterTexture();
    this.makeLavaTexture();
    this.makeSpikesTexture();
    this.makeGoalTexture();
    this.makeLeverTexture();
    this.makeAncientDoorTexture();
    this.makeFireballTexture();
  }

  private makePlatformTexture(
    key: string,
    soil: number,
    grass: number,
    outline: number,
    moving: boolean,
    disappearing: boolean
  ): void {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.18);
    g.fillRoundedRect(5, 28, 118, 14, 8);
    g.lineStyle(3, outline, 1);
    g.fillStyle(soil, 1);
    g.fillRoundedRect(6, 10, 116, 27, 8);
    g.strokeRoundedRect(6, 10, 116, 27, 8);
    g.fillStyle(grass, 1);
    g.fillRoundedRect(6, 7, 116, 12, 7);
    g.fillStyle(disappearing ? 0xe2f28a : 0x7bd36c, 1);
    for (let x = 10; x < 118; x += 14) {
      g.fillTriangle(x, 10, x + 7, 2 + (x % 3), x + 14, 10);
    }
    g.fillStyle(0x3d271a, 0.32);
    g.fillCircle(28, 25, 3);
    g.fillCircle(78, 29, 2);
    g.lineStyle(2, 0x3a2418, 0.35);
    g.lineBetween(43, 22, 60, 27);
    g.lineBetween(88, 20, 105, 25);

    if (moving) {
      g.lineStyle(3, 0xd6f8ff, 0.85);
      g.lineBetween(20, 34, 108, 34);
      g.fillStyle(0x2f8fa6, 1);
      g.fillCircle(20, 34, 4);
      g.fillCircle(108, 34, 4);
    }

    if (disappearing) {
      g.lineStyle(2, 0xfff4b5, 0.9);
      g.lineBetween(32, 17, 38, 27);
      g.lineBetween(70, 18, 66, 31);
      g.lineBetween(96, 17, 105, 27);
    }

    g.generateTexture(key, 128, 44);
    g.destroy();
  }

  private makeMudTexture(): void {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.18);
    g.fillEllipse(32, 24, 62, 10);
    g.lineStyle(3, 0x2b1710, 1);
    g.fillStyle(0x5a3322, 1);
    g.fillRoundedRect(2, 8, 60, 22, 10);
    g.strokeRoundedRect(2, 8, 60, 22, 10);
    g.fillStyle(0x74452d, 1);
    g.fillEllipse(18, 15, 22, 8);
    g.fillEllipse(42, 21, 25, 9);
    g.fillStyle(0x3a2118, 0.6);
    g.fillCircle(22, 24, 3);
    g.fillCircle(48, 15, 2);
    g.generateTexture('mud', 64, 34);
    g.destroy();
  }

  private makeWaterTexture(): void {
    const g = this.add.graphics();
    g.fillStyle(0x1c9bd7, 1);
    g.fillRoundedRect(0, 7, 64, 24, 8);
    g.fillStyle(0x6ed6ff, 0.85);
    for (let x = -6; x < 64; x += 18) {
      g.fillEllipse(x + 9, 12, 20, 7);
    }
    g.lineStyle(2, 0xd5f7ff, 0.9);
    g.beginPath();
    g.moveTo(5, 18);
    g.lineTo(15, 15);
    g.lineTo(25, 18);
    g.lineTo(35, 15);
    g.lineTo(45, 18);
    g.lineTo(58, 15);
    g.strokePath();
    g.generateTexture('water', 64, 36);
    g.destroy();
  }

  private makeLavaTexture(): void {
    const g = this.add.graphics();
    g.fillStyle(0xcc3300, 1);
    g.fillRoundedRect(0, 7, 64, 24, 8);
    g.fillStyle(0xff6600, 0.85);
    for (let x = -6; x < 64; x += 18) {
      g.fillEllipse(x + 9, 12, 20, 7);
    }
    g.lineStyle(2, 0xffcc00, 0.9);
    g.beginPath();
    g.moveTo(5, 18);
    g.lineTo(15, 15);
    g.lineTo(25, 18);
    g.lineTo(35, 15);
    g.lineTo(45, 18);
    g.lineTo(58, 15);
    g.strokePath();
    g.fillStyle(0xff9900, 0.5);
    g.fillCircle(8, 14, 3);
    g.fillCircle(28, 16, 2);
    g.fillCircle(48, 14, 3);
    g.generateTexture('lava', 64, 36);
    g.destroy();
  }

  private makeSpikesTexture(): void {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.18);
    g.fillEllipse(32, 29, 60, 6);
    for (let x = 2; x < 64; x += 16) {
      g.lineStyle(3, 0x303943, 1);
      g.fillStyle(0xbfc8d1, 1);
      g.fillTriangle(x, 30, x + 8, 3, x + 16, 30);
      g.strokeTriangle(x, 30, x + 8, 3, x + 16, 30);
      g.fillStyle(0xffffff, 0.45);
      g.fillTriangle(x + 7, 8, x + 10, 22, x + 13, 24);
    }
    g.generateTexture('spikes', 66, 34);
    g.destroy();
  }

  private makeGoalTexture(): void {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.16);
    g.fillEllipse(32, 89, 54, 8);
    g.lineStyle(3, 0x4d2c19, 1);
    g.fillStyle(0x8a552e, 1);
    g.fillRoundedRect(8, 68, 48, 17, 8);
    g.strokeRoundedRect(8, 68, 48, 17, 8);
    g.fillStyle(0xb8733d, 1);
    g.fillRoundedRect(13, 63, 38, 12, 6);
    g.lineStyle(2, 0x5b351f, 1);
    g.lineBetween(18, 67, 46, 67);
    g.lineBetween(15, 74, 50, 74);
    g.lineStyle(3, 0x5b351f, 1);
    g.lineBetween(32, 65, 32, 20);
    g.fillStyle(0x2f9e44, 1);
    g.fillTriangle(32, 22, 58, 31, 32, 40);
    g.lineStyle(2, 0x1f5e2a, 1);
    g.strokeTriangle(32, 22, 58, 31, 32, 40);
    g.fillStyle(0xfff4b5, 1);
    g.fillCircle(47, 31, 4);
    g.fillStyle(0x58b368, 1);
    g.fillEllipse(22, 59, 12, 8);
    g.fillEllipse(42, 58, 12, 8);
    g.generateTexture('goal', 64, 96);
    g.destroy();
  }

  private makeLeverTexture(): void {
    const g = this.add.graphics();
    g.lineStyle(3, 0x3a2a1a, 1);
    g.fillStyle(0x6a4a2a, 1);
    g.fillRoundedRect(6, 20, 20, 18, 4);
    g.strokeRoundedRect(6, 20, 20, 18, 4);
    g.fillStyle(0x8a6a3a, 1);
    g.fillCircle(16, 29, 6);
    g.lineStyle(4, 0xcc8800, 1);
    g.lineBetween(16, 29, 16, 4);
    g.fillStyle(0xffcc00, 1);
    g.fillCircle(16, 4, 5);
    g.generateTexture('lever', 32, 42);
    g.destroy();
  }

  private makeAncientDoorTexture(): void {
    const g = this.add.graphics();
    g.lineStyle(3, 0x3a2a1a, 1);
    g.fillStyle(0x6a4a2a, 1);
    g.fillRoundedRect(0, 0, 24, 80, 4);
    g.strokeRoundedRect(0, 0, 24, 80, 4);
    g.fillStyle(0x8a6a3a, 1);
    g.fillCircle(12, 20, 6);
    g.fillCircle(12, 50, 6);
    g.lineStyle(2, 0xcc8800, 1);
    g.lineBetween(12, 10, 12, 60);
    g.lineBetween(4, 35, 20, 35);
    g.generateTexture('ancient-door', 24, 80);
    g.destroy();
  }
}

import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../game/config';
import { Collectible } from '../entities/Collectible';
import { Enemy } from '../entities/Enemy';
import { Player } from '../entities/Player';
import { getLevel } from '../levels/levelData';
import { Hud } from '../systems/Hud';
import { LevelManager } from '../systems/LevelManager';
import { AudioManager } from '../systems/AudioManager';
import type { GameSceneData, LevelData, PlatformData } from '../types';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private enemies!: Phaser.GameObjects.Group;
  private hud!: Hud;
  private level!: LevelData;
  private lives = 3;
  private score = 0;
  private seeds = 0;
  private watermelons = 0;
  private totalWatermelons = 0;
  private invulnerableUntil = 0;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private movingPlatforms!: Phaser.Physics.Arcade.Group;
  private hazards!: Phaser.Physics.Arcade.StaticGroup;
  private collectibles!: Phaser.Physics.Arcade.Group;
  private goal!: Phaser.Physics.Arcade.Image;
  private audio = AudioManager.getInstance();

  constructor() {
    super('GameScene');
  }

  init(data: GameSceneData): void {
    this.level = getLevel(data.levelId ?? 1);
    this.lives = data.lives ?? 3;
    this.score = data.score ?? 0;
    this.seeds = data.seeds ?? 0;
    this.watermelons = 0;
    this.invulnerableUntil = 0;
  }

  create(): void {
    this.audio.startMusic(this);
    this.createBackground();
    this.createLevelObjects();
    this.createPlayer();
    this.events.on('player-jump', () => this.audio.playJump(this));
    this.createCollisions();
    this.createInstructions();

    this.hud = new Hud(this);
    this.updateHud();
  }

  update(time: number): void {
    this.player.update(time);
    this.enemies.children.each((enemy) => {
      (enemy as Enemy).update(time);
      return true;
    });

    if (this.player.y > GAME_HEIGHT + 80) {
      this.damagePlayer(true);
    }
  }

  private createBackground(): void {
    const skyColor = this.level.id >= 5 ? 0x496978 : 0x84d8ef;
    const horizonColor = this.level.id >= 5 ? 0x385447 : 0x9edb8b;
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, skyColor);
    this.add.rectangle(GAME_WIDTH / 2, 330, GAME_WIDTH, 210, horizonColor).setAlpha(0.55);

    this.createCloud(165, 85, 0.85);
    this.createCloud(720, 118, 0.65);
    this.createCloud(470, 70, 0.5);

    for (let x = -40; x < GAME_WIDTH + 80; x += 90) {
      this.add.rectangle(x + 32, 338, 28, 145, 0x55713b).setAlpha(0.55);
      this.add.triangle(x + 32, 235, -34, 88, 34, 88, 0, 0, 0x3f6b3c).setAlpha(0.68);
      this.add.triangle(x + 8, 282, -26, 72, 26, 72, 0, 0, 0x4f8844).setAlpha(0.58);
    }

    this.add.rectangle(GAME_WIDTH / 2, 505, GAME_WIDTH, 70, 0x2f9e44);
    for (let x = 8; x < GAME_WIDTH; x += 42) {
      this.add.ellipse(x, 477 + (x % 3) * 5, 58, 28, x % 2 === 0 ? 0x2a8f3d : 0x3fad4d);
      this.add.ellipse(x + 20, 487, 42, 20, 0x5bbf57);
    }

    this.add.text(24, 58, this.level.name, {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#ffffff',
      stroke: '#1d2b2f',
      strokeThickness: 4
    }).setDepth(50);
  }

  private createCloud(x: number, y: number, scale: number): void {
    const cloud = this.add.container(x, y);
    cloud.add([
      this.add.ellipse(0, 12, 72, 28, 0xffffff, 0.7),
      this.add.ellipse(-28, 15, 42, 22, 0xffffff, 0.65),
      this.add.ellipse(26, 13, 48, 24, 0xffffff, 0.62),
      this.add.ellipse(-5, 0, 44, 34, 0xffffff, 0.75)
    ]);
    cloud.setScale(scale);
    cloud.setDepth(0);
  }

  private createLevelObjects(): void {
    this.platforms = this.physics.add.staticGroup();
    this.movingPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });
    this.hazards = this.physics.add.staticGroup();
    this.collectibles = this.physics.add.group({ allowGravity: false });
    this.enemies = this.add.group();

    this.level.platforms.forEach((platform) => this.createPlatform(platform));
    this.level.hazards.forEach((hazard) => {
      const sprite = this.hazards.create(hazard.x, hazard.y, hazard.type) as Phaser.Physics.Arcade.Image;
      sprite.setDisplaySize(hazard.width, hazard.height);
      sprite.refreshBody();
      sprite.setData('type', hazard.type);
    });
    this.level.collectibles.forEach((item) => {
      this.collectibles.add(new Collectible(this, item));
    });
    this.level.enemies.forEach((enemy) => {
      this.enemies.add(new Enemy(this, enemy));
    });

    this.totalWatermelons = this.level.collectibles.filter((item) => item.type === 'watermelon').length;
    this.goal = this.physics.add.staticImage(this.level.goal.x, this.level.goal.y, 'goal');
    this.goal.setDisplaySize(this.level.goal.width, this.level.goal.height);
    this.goal.refreshBody();
  }

  private createPlatform(platform: PlatformData): void {
    const key = platform.disappearing ? 'disappearing-platform' : platform.moving ? 'moving-platform' : 'platform';
    if (platform.moving) {
      const sprite = this.movingPlatforms.create(platform.x, platform.y, key) as Phaser.Physics.Arcade.Image;
      sprite.setDisplaySize(platform.width, platform.height);
      sprite.setData('startX', platform.x);
      sprite.setData('startY', platform.y);
      sprite.setData('moving', platform.moving);
      sprite.body?.setSize(platform.width, platform.height);
      this.tweens.add({
        targets: sprite,
        x: platform.moving.axis === 'x' ? platform.x + platform.moving.distance : platform.x,
        y: platform.moving.axis === 'y' ? platform.y + platform.moving.distance : platform.y,
        duration: (platform.moving.distance / platform.moving.speed) * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      return;
    }

    const sprite = this.platforms.create(platform.x, platform.y, key) as Phaser.Physics.Arcade.Image;
    sprite.setDisplaySize(platform.width, platform.height);
    sprite.refreshBody();
    sprite.setData('disappearing', platform.disappearing ?? false);
  }

  private createPlayer(): void {
    this.player = new Player(this, this.level.playerStart.x, this.level.playerStart.y);
  }

  private createCollisions(): void {
    this.physics.add.collider(this.player, this.platforms, (_, platform) => {
      const platformImage = platform as Phaser.Physics.Arcade.Image;
      if (platformImage.getData('disappearing')) {
        this.time.delayedCall(350, () => {
          platformImage.disableBody(true, true);
          this.time.delayedCall(1800, () => platformImage.enableBody(false, platformImage.x, platformImage.y, true, true));
        });
      }
    });
    this.physics.add.collider(this.player, this.movingPlatforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.enemies, this.movingPlatforms);

    this.physics.add.overlap(this.player, this.collectibles, (_, collectible) => {
      this.collectItem(collectible as Collectible);
    });
    this.physics.add.overlap(this.player, this.hazards, (_, hazard) => {
      const type = (hazard as Phaser.Physics.Arcade.Image).getData('type');
      if (type === 'mud') {
        this.player.applyMudSlow(this.time.now);
        return;
      }

      this.damagePlayer(type === 'water');
    });
    this.physics.add.overlap(this.player, this.enemies, () => this.damagePlayer(false));
    this.physics.add.overlap(this.player, this.goal, () => this.completeLevel());
  }

  private collectItem(collectible: Collectible): void {
    if (!collectible.active) {
      return;
    }

    if (collectible.collectibleType === 'watermelon') {
      this.watermelons += 1;
      this.score += 100;
      this.audio.playWatermelon();
    } else {
      this.seeds += 1;
      this.score += 500;
      this.audio.playSeed();
    }

    collectible.disableBody(true, true);
    this.updateHud();
  }

  private damagePlayer(resetPosition: boolean): void {
    if (this.time.now < this.invulnerableUntil) {
      return;
    }

    this.lives -= 1;
    this.audio.playCapiHit(this);
    this.invulnerableUntil = this.time.now + 1200;
    this.cameras.main.shake(160, 0.008);
    this.player.setTint(0xff7777);
    this.time.delayedCall(250, () => this.player.clearTint());

    if (this.lives <= 0) {
      this.scene.start('GameOverScene', { levelId: this.level.id, score: this.score, seeds: this.seeds });
      return;
    }

    if (resetPosition) {
      this.respawnPlayer();
    } else {
      this.player.setVelocity(-180, -260);
    }

    this.updateHud();
  }

  private respawnPlayer(): void {
    this.player.setPosition(this.level.playerStart.x, this.level.playerStart.y);
    this.player.setVelocity(0, 0);
  }

  private completeLevel(): void {
    const next = LevelManager.getNextLevel(this.level.id);
    this.audio.playLevelUp(this);

    if (next === 'boss') {
      this.scene.start('BossScene', { lives: this.lives, score: this.score, seeds: this.seeds });
      return;
    }

    this.scene.start('GameScene', {
      levelId: next,
      lives: this.lives,
      score: this.score,
      seeds: this.seeds
    });
  }

  private createInstructions(): void {
    const text = this.add.text(
      480,
      88,
      'Mover: Flechas/A-D   Saltar: Espacio/Flecha arriba/W   Evita enemigos y llega a la bandera',
      {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#17313b',
        backgroundColor: '#ffffffcc',
        padding: { x: 10, y: 6 }
      }
    ).setOrigin(0.5).setDepth(100);

    this.tweens.add({
      targets: text,
      alpha: 0,
      delay: 5200,
      duration: 700,
      onComplete: () => text.destroy()
    });
  }

  private updateHud(): void {
    this.hud?.update({
      level: this.level.id,
      lives: this.lives,
      score: this.score,
      watermelons: this.watermelons,
      totalWatermelons: this.totalWatermelons,
      seeds: this.seeds
    });
  }
}

import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../game/config';
import { Collectible } from '../entities/Collectible';
import { Enemy } from '../entities/Enemy';
import { Player } from '../entities/Player';
import { getLevel } from '../levels/levelData';
import { Hud } from '../systems/Hud';
import { LevelManager } from '../systems/LevelManager';
import { AudioManager } from '../systems/AudioManager';
import { RisingHazardSystem } from '../systems/RisingHazardSystem';
import type { GameSceneData, LevelData, PlatformData, SteamJetData } from '../types';

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
  private steamJets!: Phaser.Physics.Arcade.Group;
  private steamHitboxes!: Phaser.Physics.Arcade.Group;
  private risingHazardSystem?: RisingHazardSystem;
  private totemProjectiles!: Phaser.Physics.Arcade.Group;
  private leverSprites!: Phaser.Physics.Arcade.Group;
  private doorSprites!: Phaser.Physics.Arcade.StaticGroup;
  private doorOpened = false;
  private levelCompleted = false;
  private perfectBonusAwarded = false;
  private windZones!: Phaser.Physics.Arcade.StaticGroup;
  private gameplayFrozen = false;
  private countdownText?: Phaser.GameObjects.Text;
  private countdownBackdrop?: Phaser.GameObjects.Rectangle;
  private countdownTimeouts: number[] = [];
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
    this.levelCompleted = false;
    this.perfectBonusAwarded = false;
  }

  create(): void {
    if (this.isVerticalEscapeLevel()) {
      this.audio.startBonusLevelMusic(this);
    } else if (LevelManager.isWorld2Level(this.level.id)) {
      this.audio.startVolcanoMusic(this);
    } else {
      this.audio.startMusic(this);
    }
    this.createBackground();
    this.createLevelObjects();
    this.createPlayer();
    this.configureWorldAndCamera();
    this.events.on('player-jump', () => this.audio.playJump(this));
    this.createCollisions();
    this.createInstructions();

    this.hud = new Hud(this);
    this.updateHud();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.clearCountdownTimeouts());

    this.input.keyboard!.on('keydown-C', () => {
      this.scene.start('BossCondorScene', { lives: this.lives, score: this.score, seeds: this.seeds });
    });
    this.input.keyboard!.on('keydown-R', () => {
      this.scene.start('GameScene', { levelId: 7, lives: this.lives, score: this.score, seeds: this.seeds });
    });
    this.input.keyboard!.on('keydown-L', () => {
      this.scene.start('GameScene', { levelId: 22, lives: this.lives, score: this.score, seeds: this.seeds });
    });

    if (this.isVerticalEscapeLevel()) {
      this.startBonusCountdown();
    }
  }

  update(time: number): void {
    if (this.gameplayFrozen) {
      return;
    }
    const deltaMs = this.game.loop.delta;
    this.player.update(time);
    this.enemies.children.each((enemy) => {
      (enemy as Enemy).update(time);
      return true;
    });

    this.risingHazardSystem?.update(deltaMs);

    const worldBottom = this.getWorldHeight() + 80;
    if (this.player.y > worldBottom) {
      if (this.isVerticalEscapeLevel()) {
        this.gameOverNow();
        return;
      }
      this.damagePlayer(true);
    }

    this.applyWindZones();
  }

  private applyWindZones(): void {
    this.windZones.children.each((zone) => {
      const zoneSprite = zone as Phaser.Physics.Arcade.Image;
      const forceX = (zoneSprite.getData('forceX') as number | undefined) ?? 0;
      const forceY = (zoneSprite.getData('forceY') as number | undefined) ?? 0;
      if ((forceX || forceY) && Phaser.Geom.Rectangle.Overlaps(
        zoneSprite.getBounds(),
        this.player.getBounds()
      )) {
        this.player.setVelocityX(this.player.body!.velocity.x + forceX * (1 / 60));
        this.player.setVelocityY(this.player.body!.velocity.y + forceY * (1 / 60));
      }
      return true;
    });
  }

  private configureWorldAndCamera(): void {
    const worldWidth = this.getWorldWidth();
    const worldHeight = this.getWorldHeight();
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.1);
    this.cameras.main.setDeadzone(GAME_WIDTH * 0.35, GAME_HEIGHT * 0.25);
    this.cameras.main.setLerp(0.1, this.isVerticalEscapeLevel() ? 0.14 : 0.1);
  }

  private getWorldWidth(): number {
    return this.level.worldWidth ?? GAME_WIDTH;
  }

  private getWorldHeight(): number {
    return this.level.worldHeight ?? GAME_HEIGHT;
  }

  private isVerticalEscapeLevel(): boolean {
    return this.level.levelType === 'vertical_escape';
  }

  private createBackground(): void {
    if (LevelManager.isWorld2Level(this.level.id)) {
      this.createVolcanoBackground();
    } else {
      this.createRiverBackground();
    }
  }

  private createRiverBackground(): void {
    if (this.isVerticalEscapeLevel()) {
      this.createVerticalRiverBackground();
      return;
    }
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

    this.addLevelName();
  }

  private createVolcanoBackground(): void {
    if (this.isVerticalEscapeLevel()) {
      this.createVerticalVolcanoBackground();
      return;
    }
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x4a2a0a);
    this.add.rectangle(GAME_WIDTH / 2, 330, GAME_WIDTH, 210, 0x3a1a0a).setAlpha(0.55);

    this.add.ellipse(750, 180, 160, 240, 0x2a0a00, 0.7);
    this.add.ellipse(760, 60, 80, 100, 0xcc4400, 0.5);
    this.add.triangle(760, 130, -20, 50, 20, 50, 0, 0, 0xff6600, 0.35);

    const glow = this.add.circle(760, 130, 50, 0xff6600, 0.15);
    this.tweens.add({
      targets: glow,
      alpha: 0.3,
      scale: 1.3,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    for (let x = -20; x < GAME_WIDTH + 40; x += 70) {
      this.add.rectangle(x + 20, 360, 24, 120, 0x4a3a2a).setAlpha(0.5);
      this.add.triangle(x + 20, 280, -20, 70, 20, 70, 0, 0, 0x5a3a1a).setAlpha(0.5);
    }

    this.add.rectangle(GAME_WIDTH / 2, 500, GAME_WIDTH, 80, 0x3a2a1a);
    for (let x = 4; x < GAME_WIDTH; x += 38) {
      this.add.ellipse(x, 480, 46, 20, 0x5a3a1a);
    }

    for (let i = 0; i < 25; i++) {
      const ax = Phaser.Math.Between(0, GAME_WIDTH);
      const ay = Phaser.Math.Between(-20, -5);
      const size = Phaser.Math.Between(2, 5);
      const ash = this.add.circle(ax, ay, size, 0x3a3a3a, 0.6);
      this.tweens.add({
        targets: ash,
        x: ax + Phaser.Math.Between(-40, 40),
        y: GAME_HEIGHT + 20,
        alpha: 0,
        duration: Phaser.Math.Between(4000, 8000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000),
        ease: 'Linear'
      });
    }

    this.addLevelName();
  }

  private createVerticalRiverBackground(): void {
    const worldHeight = this.getWorldHeight();
    this.add.rectangle(GAME_WIDTH / 2, worldHeight / 2, GAME_WIDTH, worldHeight, 0x5aa7c7);
    for (let y = 80; y < worldHeight; y += 210) {
      this.add.rectangle(GAME_WIDTH / 2, y, GAME_WIDTH, 150, 0x4b8aa6, 0.35);
      this.add.ellipse(760, y - 40, 250, 85, 0x91e4ff, 0.2);
      this.add.ellipse(200, y + 10, 220, 70, 0x85d8f3, 0.22);
    }
    for (let y = 50; y < worldHeight; y += 190) {
      this.add.rectangle(110, y + 85, 34, 170, 0x4f6b3e, 0.42);
      this.add.rectangle(840, y + 95, 28, 160, 0x4f6b3e, 0.38);
    }
    this.addLevelName();
  }

  private createVerticalVolcanoBackground(): void {
    const worldHeight = this.getWorldHeight();
    this.add.rectangle(GAME_WIDTH / 2, worldHeight / 2, GAME_WIDTH, worldHeight, 0x2f1308);
    for (let y = 120; y < worldHeight; y += 220) {
      this.add.rectangle(GAME_WIDTH / 2, y, GAME_WIDTH, 150, 0x4f210f, 0.42);
      this.add.ellipse(220, y + 20, 200, 60, 0x8f3b13, 0.18);
      this.add.ellipse(760, y - 40, 220, 75, 0xb24a17, 0.14);
    }
    for (let i = 0; i < 35; i++) {
      const ax = Phaser.Math.Between(40, GAME_WIDTH - 40);
      const ay = Phaser.Math.Between(20, worldHeight - 50);
      const ember = this.add.circle(ax, ay, Phaser.Math.Between(2, 4), 0xff7a1a, 0.45);
      this.tweens.add({
        targets: ember,
        alpha: 0.05,
        duration: Phaser.Math.Between(450, 1000),
        yoyo: true,
        repeat: -1
      });
    }
    this.addLevelName();
  }

  private addLevelName(): void {
    this.add.text(24, 58, this.level.name, {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#ffffff',
      stroke: '#1d2b2f',
      strokeThickness: 4
    }).setDepth(50).setScrollFactor(0);
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
    this.totemProjectiles = this.physics.add.group({ allowGravity: false });
    this.steamJets = this.physics.add.group({ allowGravity: false, immovable: true });
    this.steamHitboxes = this.physics.add.group({ allowGravity: false, immovable: true });
    this.leverSprites = this.physics.add.group({ allowGravity: false });
    this.doorSprites = this.physics.add.staticGroup();
    this.windZones = this.physics.add.staticGroup();
    this.doorOpened = false;

    this.level.platforms.forEach((platform) => this.createPlatform(platform));
    this.level.hazards.forEach((hazard) => {
      const sprite = this.hazards.create(hazard.x, hazard.y, hazard.type) as Phaser.Physics.Arcade.Image;
      sprite.setDisplaySize(hazard.width, hazard.height);
      sprite.refreshBody();
      sprite.setData('type', hazard.type);
      if (hazard.type === 'lava') {
        this.tweens.add({
          targets: sprite,
          alpha: 0.7,
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
      if (this.level.id === 22 && hazard.type === 'spikes') {
        sprite.setTint(0xff5544);
      }
    });

    this.level.steamJets?.forEach((steamJet) => this.createSteamJet(steamJet));
    this.level.collectibles.forEach((item) => {
      this.collectibles.add(new Collectible(this, item));
    });
    this.level.enemies.forEach((enemy) => {
      const e = new Enemy(this, enemy);
      this.enemies.add(e);
      if (enemy.kind === 'totem') {
        this.time.addEvent({
          delay: 2200,
          loop: true,
          callback: () => this.shootTotemProjectile(e as Enemy)
        });
      }
    });

    this.level.windZones?.forEach((zone) => {
      const windSprite = this.windZones.create(zone.x, zone.y, 'water') as Phaser.Physics.Arcade.Image;
      windSprite.setDisplaySize(zone.width, zone.height);
      windSprite.refreshBody();
      windSprite.setData('forceX', zone.forceX ?? 0);
      windSprite.setData('forceY', zone.forceY ?? 0);
      windSprite.setAlpha(0.3);
      windSprite.setTint(0xaaddff);
    });

    if (this.level.risingHazard) {
      this.risingHazardSystem = new RisingHazardSystem(this, this.level.risingHazard, this.getWorldWidth(), this.getWorldHeight());
    } else {
      this.risingHazardSystem = undefined;
    }

    this.level.levers?.forEach((lever) => {
      const door = this.doorSprites.create(lever.doorX, lever.doorY, 'ancient-door') as Phaser.Physics.Arcade.Image;
      door.setDisplaySize(lever.doorWidth, lever.doorHeight);
      door.refreshBody();
      door.setData('closed', true);

      const leverSprite = this.leverSprites.create(lever.x, lever.y, 'lever') as Phaser.Physics.Arcade.Image;
      (leverSprite.body as Phaser.Physics.Arcade.Body).allowGravity = false;
      leverSprite.setData('lever', lever);
      leverSprite.setData('door', door);
    });

    this.totalWatermelons = this.level.collectibles.filter((item) => item.type === 'watermelon').length;
    this.goal = this.physics.add.staticImage(this.level.goal.x, this.level.goal.y, 'goal');
    this.goal.setDisplaySize(this.level.goal.width, this.level.goal.height);
    this.goal.refreshBody();
  }

  private createSteamJet(steamJet: SteamJetData): void {
    const visual = this.steamJets.create(steamJet.x, steamJet.y, 'water') as Phaser.Physics.Arcade.Image;
    visual.setDisplaySize(steamJet.width, steamJet.height);
    visual.setTint(0xddeeff);
    visual.setAlpha(0.28);
    (visual.body as Phaser.Physics.Arcade.Body).allowGravity = false;
    visual.setData('active', false);

    const hitbox = this.steamHitboxes.create(steamJet.x, steamJet.y, 'water') as Phaser.Physics.Arcade.Image;
    hitbox.setDisplaySize(steamJet.width * 0.85, steamJet.height * 0.85);
    hitbox.setVisible(false);
    (hitbox.body as Phaser.Physics.Arcade.Body).allowGravity = false;
    hitbox.setData('type', 'steam');
    hitbox.disableBody(true, false);

    const activate = () => {
      visual.setAlpha(0.55);
      visual.setTint(0xffffff);
      hitbox.enableBody(false, hitbox.x, hitbox.y, true, false);
      this.time.delayedCall(steamJet.activeMs, () => {
        hitbox.disableBody(true, false);
        visual.setAlpha(0.2);
        visual.setTint(0xddeeff);
      });
    };

    this.time.addEvent({
      delay: steamJet.activeMs + steamJet.cooldownMs,
      loop: true,
      startAt: steamJet.startDelayMs ?? 0,
      callback: activate
    });
  }

  private createPlatform(platform: PlatformData): void {
    const key = platform.disappearing ? 'disappearing-platform' : platform.moving ? 'moving-platform' : platform.breakable ? 'breakable-platform' : 'platform';
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
    sprite.setData('breakable', platform.breakable ?? false);
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
      if (platformImage.getData('breakable') && !platformImage.getData('breaking')) {
        platformImage.setData('breaking', true);
        platformImage.setTint(0xff8888);
        this.tweens.add({
          targets: platformImage,
          x: platformImage.x + 3,
          duration: 50,
          yoyo: true,
          repeat: 3
        });
        this.time.delayedCall(400, () => {
          platformImage.disableBody(true, true);
          this.time.delayedCall(3000, () => {
            platformImage.clearTint();
            platformImage.setData('breaking', false);
            platformImage.enableBody(false, platformImage.x, platformImage.y, true, true);
          });
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
      if (this.isVerticalEscapeLevel() && (type === 'water' || type === 'lava')) {
        this.gameOverNow();
        return;
      }
      const resetPos = type === 'water' || type === 'lava';
      this.damagePlayer(resetPos);
    });
    this.physics.add.overlap(this.player, this.steamHitboxes, () => this.damagePlayer(false));
    if (this.risingHazardSystem) {
      this.physics.add.overlap(this.player, this.risingHazardSystem.getHazard(), (_, risingHazard) => {
        const damageMode = (risingHazard as Phaser.Physics.Arcade.Image).getData('damageMode') as 'reset' | 'hit';
        if (this.isVerticalEscapeLevel()) {
          this.gameOverNow();
          return;
        }
        this.damagePlayer(damageMode === 'reset');
      });
    }
    this.physics.add.overlap(this.player, this.enemies, () => this.damagePlayer(false));
    this.physics.add.overlap(this.player, this.totemProjectiles, (_, projectile) => {
      (projectile as Phaser.Physics.Arcade.Image).disableBody(true, true);
      this.damagePlayer(false);
    });
    this.physics.add.overlap(this.player, this.leverSprites, (_, lever) => {
      const leverImage = lever as Phaser.Physics.Arcade.Image;
      if (leverImage.getData('activated')) {
        return;
      }
      leverImage.setData('activated', true);
      leverImage.setTint(0x88ff88);
      const door = leverImage.getData('door') as Phaser.Physics.Arcade.Image;
      if (door) {
        door.disableBody(true, true);
      }
      this.doorOpened = true;
    });
    this.physics.add.overlap(this.player, this.goal, () => this.completeLevel());
  }

  private shootTotemProjectile(totem: Enemy): void {
    if (!totem.active) {
      return;
    }

    const dir = this.player.x < totem.x ? -1 : 1;
    const proj = this.totemProjectiles.create(totem.x, totem.y - 10, 'moving-platform') as Phaser.Physics.Arcade.Image;
    proj.setDisplaySize(16, 16);
    proj.setTint(0xff6600);
    proj.setVelocityX(dir * 180);
    this.time.delayedCall(2500, () => proj.disableBody(true, true));
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

  private gameOverNow(): void {
    this.lives = 0;
    this.audio.playCapiHit(this);
    this.scene.start('GameOverScene', { levelId: this.level.id, score: this.score, seeds: this.seeds });
  }

  private completeLevel(): void {
    if (this.levelCompleted) {
      return;
    }
    this.levelCompleted = true;
    this.risingHazardSystem?.pause();
    this.awardPerfectWatermelonBonus();
    const next = LevelManager.getNextLevel(this.level.id);
    this.audio.playLevelUp(this);

    if (next === 'BossScene') {
      this.scene.start('BossScene', { lives: this.lives, score: this.score, seeds: this.seeds, nextLevelId: this.level.id + 1 });
      return;
    }

    if (next === 'BossCondorScene') {
      this.scene.start('BossCondorScene', { lives: this.lives, score: this.score, seeds: this.seeds });
      return;
    }

    if (next === 'BossJaguarScene') {
      this.scene.start('BossJaguarScene', { lives: this.lives, score: this.score, seeds: this.seeds, nextLevelId: this.level.id + 1 });
      return;
    }

    if (next === 'IntermediateBossScene') {
      this.scene.start('IntermediateBossScene', { lives: this.lives, score: this.score, seeds: this.seeds, nextLevelId: this.level.id + 1 });
      return;
    }

    if (next === 'BossFrogScene') {
      this.scene.start('BossFrogScene', { lives: this.lives, score: this.score, seeds: this.seeds, nextLevelId: this.level.id + 1 });
      return;
    }

    this.scene.start('GameScene', {
      levelId: next as number,
      lives: this.lives,
      score: this.score,
      seeds: this.seeds
    });
  }

  private awardPerfectWatermelonBonus(): void {
    if (this.perfectBonusAwarded || this.level.perfectBonus?.type !== 'all_watermelons') {
      return;
    }
    if (this.totalWatermelons === 0 || this.watermelons !== this.totalWatermelons) {
      return;
    }

    this.perfectBonusAwarded = true;
    if (this.level.perfectBonus.reward === 'extra_life') {
      this.lives += 1;
      this.updateHud();
      const bonusText = this.add.text(this.cameras.main.midPoint.x, 130, '¡Todas las sandias! +1 vida', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#1d2b2f',
        strokeThickness: 4,
        backgroundColor: '#2f9e44cc',
        padding: { x: 12, y: 8 }
      }).setOrigin(0.5).setDepth(150).setScrollFactor(0);
      this.tweens.add({
        targets: bonusText,
        alpha: 0,
        y: 90,
        delay: 1200,
        duration: 750,
        onComplete: () => bonusText.destroy()
      });
    }
  }

  private createInstructions(): void {
    const levelMessage = this.level.id === 7
      ? '¡Sube antes de que el agua te alcance!'
      : this.level.id === 22
        ? '¡Escapa de la lava!'
        : 'Mover: Flechas/A-D   Saltar: Espacio/Flecha arriba/W   Evita enemigos y llega a la bandera';
    const text = this.add.text(
      480,
      88,
      levelMessage,
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

  private startBonusCountdown(): void {
    this.gameplayFrozen = true;
    this.physics.world.pause();
    this.tweens.pauseAll();
    this.time.timeScale = 0;

    this.countdownBackdrop = this.add
      .rectangle(this.cameras.main.centerX, this.cameras.main.centerY, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.28)
      .setDepth(240)
      .setScrollFactor(0);

    this.countdownText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, '3', {
      fontFamily: 'Arial Black',
      fontSize: '92px',
      color: '#ffffff',
      stroke: '#1d2b2f',
      strokeThickness: 10
    }).setOrigin(0.5).setDepth(250).setScrollFactor(0);

    if (this.cache.audio.exists('countdown')) {
      this.sound.play('countdown', { volume: 1.8 });
    }

    this.scheduleCountdownText('3', 0);
    this.scheduleCountdownText('2', 1000);
    this.scheduleCountdownText('1', 2000);
    this.scheduleCountdownText('JUMP', 3000);
    this.scheduleCountdownFinish(4500);
  }

  private scheduleCountdownText(text: string, delayMs: number): void {
    const id = window.setTimeout(() => {
      this.countdownText?.setText(text);
      this.countdownText?.setScale(text === 'JUMP' ? 1.15 : 1);
    }, delayMs);
    this.countdownTimeouts.push(id);
  }

  private scheduleCountdownFinish(delayMs: number): void {
    const id = window.setTimeout(() => {
      this.gameplayFrozen = false;
      this.physics.world.resume();
      this.tweens.resumeAll();
      this.time.timeScale = 1;
      this.countdownText?.destroy();
      this.countdownBackdrop?.destroy();
      this.countdownText = undefined;
      this.countdownBackdrop = undefined;
      this.clearCountdownTimeouts();
    }, delayMs);
    this.countdownTimeouts.push(id);
  }

  private clearCountdownTimeouts(): void {
    this.countdownTimeouts.forEach((id) => window.clearTimeout(id));
    this.countdownTimeouts = [];
  }
}

import Phaser from 'phaser';
import { BossFrog } from '../entities/BossFrog';
import { Player } from '../entities/Player';
import { AudioManager } from '../systems/AudioManager';
import { Hud } from '../systems/Hud';
import type { GameSceneData } from '../types';

export class BossFrogScene extends Phaser.Scene {
  private player!: Player;
  private boss!: BossFrog;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private tongues!: Phaser.Physics.Arcade.Group;
  private hud!: Hud;
  private lives = 3;
  private score = 0;
  private seeds = 0;
  private nextLevelId = 6;
  private invulnerableUntil = 0;
  private audio = AudioManager.getInstance();

  constructor() {
    super('BossFrogScene');
  }

  init(data: GameSceneData): void {
    this.lives = data.lives ?? 3;
    this.score = data.score ?? 0;
    this.seeds = data.seeds ?? 0;
    this.nextLevelId = data.nextLevelId ?? 6;
  }

  create(): void {
    this.audio.startIntermediateBossMusic(this);
    this.add.rectangle(480, 270, 960, 540, 0x1a4a1a);
    this.add.text(480, 55, 'Rana Gigante', {
      fontFamily: 'Arial',
      fontSize: '34px',
      color: '#ffffff',
      stroke: '#0d2f0d',
      strokeThickness: 5
    }).setOrigin(0.5);

    this.platforms = this.physics.add.staticGroup();
    const ground = this.platforms.create(480, 510, 'platform') as Phaser.Physics.Arcade.Image;
    ground.setDisplaySize(960, 60);
    ground.refreshBody();

    this.player = new Player(this, 140, 420);
    this.events.on('player-jump', () => this.audio.playJump(this));
    this.boss = new BossFrog(this, 740, 400);
    this.tongues = this.physics.add.group({ allowGravity: false });

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.boss, this.platforms);
    this.physics.add.overlap(this.player, this.boss, () => this.handleBossContact());
    this.physics.add.overlap(this.player, this.tongues, (_, tongue) => {
      (tongue as Phaser.Physics.Arcade.Image).disableBody(true, true);
      this.damagePlayer();
    });

    this.time.addEvent({
      delay: 1500,
      loop: true,
      callback: () => this.launchTongue()
    });

    this.hud = new Hud(this);
    this.updateHud();
  }

  update(time: number): void {
    this.player.update(time);
    this.boss.update();
  }

  private handleBossContact(): void {
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    if (playerBody.velocity.y > 80 && this.player.y < this.boss.y - 20) {
      if (!this.boss.vulnerable) {
        this.player.setVelocityY(-300);
        return;
      }

      const defeated = this.boss.takeHit();
      this.audio.playBossDamage(this);
      this.player.setVelocityY(-360);
      this.score += 500;
      this.updateHud();

      if (defeated) {
        this.scene.start('GameScene', {
          levelId: this.nextLevelId,
          lives: this.lives,
          score: this.score,
          seeds: this.seeds
        });
      }
      return;
    }

    this.damagePlayer();
  }

  private launchTongue(): void {
    if (!this.boss.active) {
      return;
    }

    const direction = this.boss.direction;
    const startX = direction === -1 ? this.boss.x - 50 : this.boss.x + 50;

    const tongue = this.tongues.create(startX, this.boss.y - 10, 'moving-platform') as Phaser.Physics.Arcade.Image;
    this.audio.playShoot(this);
    tongue.setDisplaySize(60, 12);
    tongue.setTint(0xc44a6e);
    tongue.setVelocityX(direction * -280);
    tongue.setData('born', this.time.now);
    this.time.delayedCall(3000, () => tongue.disableBody(true, true));
  }

  private damagePlayer(): void {
    if (this.time.now < this.invulnerableUntil) {
      return;
    }

    this.lives -= 1;
    this.audio.playCapiHit(this);
    this.invulnerableUntil = this.time.now + 1200;
    this.player.setTint(0xff7777);
    this.cameras.main.shake(160, 0.008);
    this.time.delayedCall(250, () => this.player.clearTint());

    if (this.lives <= 0) {
      this.scene.start('GameOverScene', { levelId: 5, score: this.score, seeds: this.seeds });
      return;
    }

    this.player.setPosition(140, 420);
    this.player.setVelocity(0, 0);
    this.updateHud();
  }

  private updateHud(): void {
    this.hud.update({
      level: 5,
      lives: this.lives,
      score: this.score,
      watermelons: 0,
      totalWatermelons: 0,
      seeds: this.seeds
    });
  }
}
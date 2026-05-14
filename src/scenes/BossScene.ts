import Phaser from 'phaser';
import { Boss } from '../entities/Boss';
import { Player } from '../entities/Player';
import { AudioManager } from '../systems/AudioManager';
import { Hud } from '../systems/Hud';
import type { GameSceneData } from '../types';

export class BossScene extends Phaser.Scene {
  private player!: Player;
  private boss!: Boss;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private projectiles!: Phaser.Physics.Arcade.Group;
  private hud!: Hud;
  private lives = 3;
  private score = 0;
  private seeds = 0;
  private nextLevelId = 0;
  private invulnerableUntil = 0;
  private audio = AudioManager.getInstance();
  private shootSide = -1;

  constructor() {
    super('BossScene');
  }

  init(data: GameSceneData): void {
    this.lives = data.lives ?? 3;
    this.score = data.score ?? 0;
    this.seeds = data.seeds ?? 0;
    this.nextLevelId = data.nextLevelId ?? 0;
  }

  create(): void {
    this.audio.startFinalBossMusic(this);
    this.add.rectangle(480, 270, 960, 540, 0x3b5f46);
    this.add.text(480, 55, 'Caiman Grunon', {
      fontFamily: 'Arial',
      fontSize: '34px',
      color: '#ffffff',
      stroke: '#1d2b2f',
      strokeThickness: 5
    }).setOrigin(0.5);

    this.platforms = this.physics.add.staticGroup();
    const ground = this.platforms.create(480, 510, 'platform') as Phaser.Physics.Arcade.Image;
    ground.setDisplaySize(960, 60);
    ground.refreshBody();

    this.player = new Player(this, 140, 420);
    this.events.on('player-jump', () => this.audio.playJump(this));
    this.boss = new Boss(this, 740, 420);
    this.projectiles = this.physics.add.group({ allowGravity: false });

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.boss, this.platforms);
    this.physics.add.overlap(this.player, this.boss, () => this.handleBossContact());
    this.physics.add.overlap(this.player, this.projectiles, (_, projectile) => {
      (projectile as Phaser.Physics.Arcade.Image).disableBody(true, true);
      this.damagePlayer();
    });

    this.time.addEvent({
      delay: 1400,
      loop: true,
      callback: () => this.launchLog()
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
      this.score += 1000;
      this.updateHud();

      if (defeated) {
        this.scene.start('VictoryScene', { score: this.score, seeds: this.seeds });
      }
      return;
    }

    this.damagePlayer();
  }

  private launchLog(): void {
    if (!this.boss.active) {
      return;
    }

    this.shootSide *= -1;

    const startX = this.shootSide === -1 ? this.boss.x - 75 : this.boss.x + 75;
    const velocityX = this.shootSide * (-220 - (3 - this.boss.hp) * 60);

    const projectile = this.projectiles.create(startX, this.boss.y - 10, 'moving-platform') as Phaser.Physics.Arcade.Image;
    this.audio.playShoot(this);
    projectile.setDisplaySize(46, 18);
    projectile.setVelocityX(velocityX);
    projectile.setData('born', this.time.now);
    this.time.delayedCall(3600, () => projectile.disableBody(true, true));
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
      this.scene.start('GameOverScene', { levelId: 15, score: this.score, seeds: this.seeds });
      return;
    }

    this.player.setPosition(140, 420);
    this.player.setVelocity(0, 0);
    this.updateHud();
  }

  private updateHud(): void {
    this.hud.update({
      level: 15,
      lives: this.lives,
      score: this.score,
      watermelons: 0,
      totalWatermelons: 0,
      seeds: this.seeds
    });
  }
}

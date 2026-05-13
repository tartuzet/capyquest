import Phaser from 'phaser';
import { BossCondor } from '../entities/BossCondor';
import { Player } from '../entities/Player';
import { AudioManager } from '../systems/AudioManager';
import { Hud } from '../systems/Hud';
import type { GameSceneData } from '../types';

export class BossCondorScene extends Phaser.Scene {
  private player!: Player;
  private boss!: BossCondor;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private embers!: Phaser.Physics.Arcade.Group;
  private hud!: Hud;
  private lives = 3;
  private score = 0;
  private seeds = 0;
  private invulnerableUntil = 0;
  private bossContactCooldown = 0;
  private audio = AudioManager.getInstance();
  private bossHpText!: Phaser.GameObjects.Text;
  private bossHpBar!: Phaser.GameObjects.Rectangle;

  constructor() {
    super('BossCondorScene');
  }

  init(data: GameSceneData): void {
    this.lives = data.lives ?? 3;
    this.score = data.score ?? 0;
    this.seeds = data.seeds ?? 0;
  }

  create(): void {
    this.audio.startFinalBossMusic(this);
    this.add.rectangle(480, 270, 960, 540, 0x2a0a00);
    this.add.text(480, 55, 'Condor de Fuego', {
      fontFamily: 'Arial',
      fontSize: '34px',
      color: '#ff8844',
      stroke: '#4a1500',
      strokeThickness: 5
    }).setOrigin(0.5);

    this.platforms = this.physics.add.staticGroup();
    const ground = this.platforms.create(480, 510, 'platform') as Phaser.Physics.Arcade.Image;
    ground.setDisplaySize(960, 60);
    ground.refreshBody();

    const midPlat = this.platforms.create(400, 370, 'platform') as Phaser.Physics.Arcade.Image;
    midPlat.setDisplaySize(140, 24);
    midPlat.refreshBody();

    const highPlat = this.platforms.create(650, 280, 'platform') as Phaser.Physics.Arcade.Image;
    highPlat.setDisplaySize(140, 24);
    highPlat.refreshBody();

    this.player = new Player(this, 140, 420);
    this.events.on('player-jump', () => this.audio.playJump(this));
    this.boss = new BossCondor(this, 740, 250);
    this.embers = this.physics.add.group({ allowGravity: false });

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.boss, () => this.handleBossContact());
    this.physics.add.overlap(this.player, this.embers, (_, ember) => {
      (ember as Phaser.Physics.Arcade.Image).disableBody(true, true);
      this.damagePlayer();
    });

    this.time.addEvent({
      delay: 2200,
      loop: true,
      callback: () => this.dropFireball()
    });

    this.createBossHpBar();
    this.hud = new Hud(this);
    this.updateHud();
  }

  update(time: number): void {
    this.player.update(time);
    this.boss.update(time);
  }

  private createBossHpBar(): void {
    this.bossHpText = this.add.text(480, 16, 'Condor de Fuego', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ff8844',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(100);

    this.add.rectangle(480, 40, 202, 14, 0x000000).setDepth(100);
    this.bossHpBar = this.add.rectangle(480, 40, 200, 12, 0xff4400).setDepth(101);
  }

  private updateBossHp(): void {
    const ratio = Math.max(0, this.boss.hp / 3);
    this.bossHpBar.setScale(ratio, 1);
  }

  private handleBossContact(): void {
    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.boss.x, this.boss.y);
    if (dist > 50) {
      return;
    }

    if (this.time.now < this.bossContactCooldown) {
      return;
    }
    this.bossContactCooldown = this.time.now + 600;

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
      this.updateBossHp();

      if (defeated) {
        this.scene.start('VictoryScene', { score: this.score, seeds: this.seeds });
      }
      return;
    }

    this.damagePlayer();
  }

  private dropFireball(): void {
    if (!this.boss.active) {
      return;
    }

    const x = Phaser.Math.Between(100, 860);
    const fireball = this.embers.create(x, -30, 'fireball') as Phaser.Physics.Arcade.Image;
    this.audio.playShoot(this);
    fireball.setVelocityY(130);
    fireball.setScale(1.2);
    this.tweens.add({
      targets: fireball,
      angle: 360,
      duration: 1000,
      repeat: -1,
      ease: 'Linear'
    });
    this.time.delayedCall(5000, () => {
      if (fireball.active) fireball.disableBody(true, true);
    });
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
      this.scene.start('GameOverScene', { levelId: 25, score: this.score, seeds: this.seeds });
      return;
    }

    this.player.setPosition(140, 420);
    this.player.setVelocity(0, 0);
    this.updateHud();
  }

  private updateHud(): void {
    this.hud.update({
      level: 25,
      lives: this.lives,
      score: this.score,
      watermelons: 0,
      totalWatermelons: 0,
      seeds: this.seeds
    });
  }
}
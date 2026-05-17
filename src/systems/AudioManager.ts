import Phaser from 'phaser';

export class AudioManager {
  private static instance: AudioManager;
  private context?: AudioContext;
  private music?: Phaser.Sound.BaseSound;
  private musicKey?: string;
  private musicVolume = 1;
  private sfxVolume = 0.72;
  private toneVolume = 0.72;
  private isSuspended = false;
  private readonly activeSfx = new Map<string, number>();
  private readonly lastPlayedAt = new Map<string, number>();
  private readonly sfxRules: Record<string, { cooldownMs: number; maxConcurrent: number }> = {
    'capi-jump': { cooldownMs: 120, maxConcurrent: 1 },
    'capi-hit': { cooldownMs: 450, maxConcurrent: 1 },
    'boss-damage': { cooldownMs: 350, maxConcurrent: 1 },
    'boss-shoot': { cooldownMs: 250, maxConcurrent: 1 },
    'level-up': { cooldownMs: 650, maxConcurrent: 1 },
    victory: { cooldownMs: 1000, maxConcurrent: 1 }
  };

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }

    return AudioManager.instance;
  }

  startMusic(scene: Phaser.Scene): void {
    this.startLoop(scene, 'bg-music', 0.7);
  }

  startFinalBossMusic(scene: Phaser.Scene): void {
    this.startLoop(scene, 'final-boss', 0.75);
  }

  startIntermediateBossMusic(scene: Phaser.Scene): void {
    this.startLoop(scene, 'intermediate-boss', 0.75);
  }

  startVolcanoMusic(scene: Phaser.Scene): void {
    this.startLoop(scene, 'volcano-theme', 0.7);
  }

  startBonusLevelMusic(scene: Phaser.Scene): void {
    const bonusSeekOffset = this.isFireTvEnvironment() ? 0.5 : 0;
    this.startLoop(scene, 'bonus-level', 0.72, bonusSeekOffset);
  }

  stopMusic(): void {
    if (!this.music) {
      return;
    }

    this.music.stop();
    this.music.destroy();
    this.music = undefined;
    this.musicKey = undefined;
  }

  pauseAllAudio(): void {
    this.music?.pause();
    const context = this.getContext();
    if (context && context.state !== 'suspended') {
      void context.suspend();
    }
    this.isSuspended = true;
  }

  resumeAllAudio(): void {
    const context = this.getContext();
    if (context && context.state === 'suspended') {
      void context.resume();
    }
    if (this.music && this.isSuspended) {
      this.music.resume();
    }
    this.isSuspended = false;
  }

  playJump(scene: Phaser.Scene): void {
    this.playSfx(scene, 'capi-jump', 0.65);
  }

  playCapiHit(scene: Phaser.Scene): void {
    this.playSfx(scene, 'capi-hit', 0.75);
  }

  playBossDamage(scene: Phaser.Scene): void {
    this.playSfx(scene, 'boss-damage', 0.8);
  }

  playShoot(scene: Phaser.Scene): void {
    this.playSfx(scene, 'boss-shoot', 0.65);
  }

  playVictory(scene: Phaser.Scene): void {
    this.playSfx(scene, 'victory', 0.85);
  }

  playLevelUp(scene: Phaser.Scene): void {
    this.playSfx(scene, 'level-up', 0.85);
  }

  playWatermelon(): void {
    this.playToneSequence([
      { frequency: 540, duration: 0.06 },
      { frequency: 760, duration: 0.08 }
    ], 'triangle', 0.16, 'watermelon-tone');
  }

  playSeed(): void {
    this.playToneSequence([
      { frequency: 880, duration: 0.07 },
      { frequency: 1175, duration: 0.08 },
      { frequency: 1568, duration: 0.12 }
    ], 'sine', 0.18, 'seed-tone');
  }

  private playSfx(scene: Phaser.Scene, key: string, volume: number): void {
    if (!scene.cache.audio.exists(key)) {
      return;
    }

    const rules = this.sfxRules[key] ?? { cooldownMs: 80, maxConcurrent: 2 };
    const now = scene.time.now;
    const lastPlayedAt = this.lastPlayedAt.get(key) ?? 0;
    const activeCount = this.activeSfx.get(key) ?? 0;

    if (now - lastPlayedAt < rules.cooldownMs || activeCount >= rules.maxConcurrent) {
      return;
    }

    this.lastPlayedAt.set(key, now);
    this.activeSfx.set(key, activeCount + 1);

    const sound = scene.sound.add(key, { volume: volume * this.sfxVolume });
    let cleanedUp = false;
    const cleanup = () => {
      if (cleanedUp) {
        return;
      }

      cleanedUp = true;
      const currentCount = this.activeSfx.get(key) ?? 1;
      this.activeSfx.set(key, Math.max(0, currentCount - 1));
      sound.destroy();
    };

    sound.once('complete', cleanup);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup);
    sound.play();
  }

  private startLoop(scene: Phaser.Scene, key: string, volume: number, seekOffset = 0): void {
    if (this.music?.isPlaying && this.musicKey === key) {
      return;
    }

    this.stopMusic();

    if (scene.cache.audio.exists(key)) {
      this.music = scene.sound.add(key, { loop: true, volume: volume * this.musicVolume, seek: seekOffset });
      this.musicKey = key;
      this.music.play();
      this.isSuspended = false;
    }
  }

  private playToneSequence(
    notes: Array<{ frequency: number; duration: number }>,
    type: OscillatorType,
    volume: number,
    throttleKey: string = type
  ): void {
    const context = this.getContext();
    if (!context) {
      return;
    }

    void context.resume();
    const now = performance.now();
    const lastPlayedAt = this.lastPlayedAt.get(throttleKey) ?? 0;
    const cooldown = throttleKey === 'seed-tone' ? 180 : 55;

    if (now - lastPlayedAt < cooldown) {
      return;
    }

    this.lastPlayedAt.set(throttleKey, now);
    let offset = 0;
    notes.forEach((note) => {
      this.playTone(note.frequency, note.duration, type, volume * this.toneVolume, offset);
      offset += note.duration;
    });
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    offset = 0
  ): void {
    const context = this.getContext();
    if (!context) {
      return;
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime + offset;
    const end = start + duration;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, end);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(end + 0.02);
  }

  private getContext(): AudioContext | undefined {
    if (this.context) {
      return this.context;
    }

    const AudioContextClass = window.AudioContext
      ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) {
      return undefined;
    }

    this.context = new AudioContextClass();
    return this.context;
  }

  private isFireTvEnvironment(): boolean {
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes('aft') || ua.includes('fire tv') || ua.includes('firetv');
  }
}

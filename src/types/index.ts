export type EnemyKind = 'frog' | 'crab' | 'toucan' | 'bat' | 'small-caiman' | 'cave-bat' | 'iguana' | 'rock-beetle' | 'totem' | 'snake' | 'fire-bird';

export type HazardType = 'spikes' | 'mud' | 'water' | 'lava';
export type LevelType = 'standard' | 'vertical_escape';

export interface PlatformData {
  x: number;
  y: number;
  width: number;
  height: number;
  moving?: {
    axis: 'x' | 'y';
    distance: number;
    speed: number;
  };
  disappearing?: boolean;
  breakable?: boolean;
}

export interface HazardData {
  type: HazardType;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CollectibleData {
  type: 'watermelon' | 'golden-seed';
  x: number;
  y: number;
}

export interface EnemyData {
  kind: EnemyKind;
  x: number;
  y: number;
  patrolDistance?: number;
  speed?: number;
}

export interface LeverData {
  x: number;
  y: number;
  doorX: number;
  doorY: number;
  doorWidth: number;
  doorHeight: number;
}

export interface WindZoneData {
  x: number;
  y: number;
  width: number;
  height: number;
  forceX?: number;
  forceY?: number;
}

export interface RisingHazardConfig {
  type: 'water' | 'lava';
  speed: number;
  startY: number;
  maxSpeed?: number;
  startDelayMs?: number;
  damageMode?: 'reset' | 'hit';
}

export interface PerfectBonusConfig {
  type: 'all_watermelons';
  reward: 'extra_life';
}

export interface SteamJetData {
  x: number;
  y: number;
  width: number;
  height: number;
  activeMs: number;
  cooldownMs: number;
  startDelayMs?: number;
}

export interface LevelData {
  id: number;
  name: string;
  theme: string;
  levelType?: LevelType;
  worldWidth?: number;
  worldHeight?: number;
  playerStart: { x: number; y: number };
  goal: { x: number; y: number; width: number; height: number };
  platforms: PlatformData[];
  hazards: HazardData[];
  collectibles: CollectibleData[];
  enemies: EnemyData[];
  levers?: LeverData[];
  windZones?: WindZoneData[];
  risingHazard?: RisingHazardConfig;
  perfectBonus?: PerfectBonusConfig;
  steamJets?: SteamJetData[];
}

export interface GameSceneData {
  levelId?: number;
  lives?: number;
  score?: number;
  seeds?: number;
  nextLevelId?: number;
}

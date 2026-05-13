export type EnemyKind = 'frog' | 'crab' | 'toucan' | 'bat' | 'small-caiman';

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
}

export interface HazardData {
  type: 'spikes' | 'mud' | 'water';
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

export interface LevelData {
  id: number;
  name: string;
  theme: string;
  playerStart: { x: number; y: number };
  goal: { x: number; y: number; width: number; height: number };
  platforms: PlatformData[];
  hazards: HazardData[];
  collectibles: CollectibleData[];
  enemies: EnemyData[];
}

export interface GameSceneData {
  levelId?: number;
  lives?: number;
  score?: number;
  seeds?: number;
  nextLevelId?: number;
}

import { levels } from '../levels/levelData';

export class LevelManager {
  static firstLevel = 1;
  static finalLevel = levels.length;

  static readonly bossLevels = new Map<number, string>([
    [5, 'BossFrogScene'],
    [10, 'IntermediateBossScene'],
    [15, 'BossScene'],
    [20, 'BossJaguarScene'],
    [25, 'BossCondorScene']
  ]);

  static getNextLevel(currentLevel: number): number | string {
    const bossScene = this.bossLevels.get(currentLevel);
    if (bossScene) {
      return bossScene;
    }

    if (currentLevel >= this.finalLevel) {
      return currentLevel;
    }

    const nextLevel = currentLevel + 1;
    const nextBossScene = this.bossLevels.get(nextLevel);
    if (nextBossScene) {
      return nextBossScene;
    }

    return nextLevel;
  }

  static isWorld2Level(levelId: number): boolean {
    return levelId >= 16;
  }
}
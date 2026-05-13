import { levels } from '../levels/levelData';

export class LevelManager {
  static firstLevel = 1;
  static finalLevel = levels.length;

  static readonly bossLevels = new Map<number, string>([
    [5, 'BossFrogScene'],
    [10, 'IntermediateBossScene']
  ]);

  static getNextLevel(currentLevel: number): number | string {
    if (currentLevel >= this.finalLevel) {
      return 'BossScene';
    }

    const bossScene = this.bossLevels.get(currentLevel);
    if (bossScene) {
      return bossScene;
    }

    return currentLevel + 1;
  }
}
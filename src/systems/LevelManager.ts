import { levels } from '../levels/levelData';

export class LevelManager {
  static firstLevel = 1;
  static finalLevel = levels.length;

  static getNextLevel(currentLevel: number): number | 'boss' {
    if (currentLevel >= this.finalLevel) {
      return 'boss';
    }

    return currentLevel + 1;
  }
}

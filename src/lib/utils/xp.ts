import type { Player } from '../types';

type TaskPriority = 'easy' | 'medium' | 'hard';

export function xpForNextLevel(level: number): number {
  return level * 100;
}

export function checkLevelUp(player: Player): { leveled: boolean; newLevel: number } {
  let { level, xp } = player;
  let leveled = false;
  while (xp >= xpForNextLevel(level)) {
    xp -= xpForNextLevel(level);
    level++;
    leveled = true;
  }
  return { leveled, newLevel: level };
}

export const TASK_COIN_REWARDS: Record<TaskPriority, number> = {
  easy: 5,
  medium: 10,
  hard: 20
};
export const TASK_XP_REWARDS: Record<TaskPriority, number> = {
  easy: 10,
  medium: 20,
  hard: 40
};

export const HABIT_BASE_COIN = 10;
export const HABIT_BASE_XP   = 15;

export const POMODORO_COIN   = 15;
export const POMODORO_XP     = 25;

import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Achievement, Habit, Player, PomodoroSession, Task } from '../types';
import { ACHIEVEMENTS } from '../utils/achievements';
import { player } from './player';
import { notifications } from './notifications';

type AchievementSyncState = {
  player: Player;
  habits: Habit[];
  tasks: Task[];
  pomodoroSessions: PomodoroSession[];
};

function getUnlockedCount(habits: Habit[]) {
  return habits.reduce((count, habit) => count + habit.completedDates.length, 0);
}

function getActiveDays(player: Player) {
  const createdAt = new Date(player.createdAt).getTime();
  const now = Date.now();
  return Math.max(1, Math.floor((now - createdAt) / (1000 * 60 * 60 * 24)) + 1);
}

function shouldUnlockAchievement(achievement: Achievement, state: AchievementSyncState) {
  const { player, habits, tasks, pomodoroSessions } = state;

  switch (achievement.condition.type) {
    case 'streak':
      return Math.max(0, ...habits.map(habit => habit.streak)) >= achievement.condition.value;
    case 'level':
      return player.level >= achievement.condition.value;
    case 'total_coins':
      return player.coins >= achievement.condition.value;
    case 'tasks_completed':
      return tasks.filter(task => task.completed).length >= achievement.condition.value;
    case 'pomodoro_sessions':
      return pomodoroSessions.filter(session => session.completed).length >= achievement.condition.value;
    case 'habits_completed':
      return habits.length >= achievement.condition.value || getUnlockedCount(habits) >= achievement.condition.value;
    case 'days_active':
      return getActiveDays(player) >= achievement.condition.value;
    default:
      return false;
  }
}

function createAchievementsStore() {
  const stored = browser ? localStorage.getItem('arcade_achievements') : null;
  let initial: Achievement[] = [...ACHIEVEMENTS];
  if (stored) {
    try {
      initial = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse achievements data', e);
    }
  }
  
  // If the initial array is empty or missing achievements from our definitions, we should merge
  const merged = ACHIEVEMENTS.map(def => {
    const existing = initial.find(a => a.id === def.id);
    return existing ? { ...def, unlocked: existing.unlocked, unlockedAt: existing.unlockedAt } : def;
  });

  const { subscribe, update, set } = writable<Achievement[]>(merged);
  let currentAchievements = merged;

  subscribe(value => {
    currentAchievements = value;
  });

  function unlockInternal(id: string) {
    update(achievements => {
      let unlockedAchievement: Achievement | undefined;

      const next = achievements.map(a => {
        if (a.id === id && !a.unlocked) {
          unlockedAchievement = { ...a, unlocked: true, unlockedAt: new Date().toISOString() };
          return unlockedAchievement;
        }
        return a;
      });

      if (unlockedAchievement) {
        currentAchievements = next;
        player.addXP(unlockedAchievement.xpReward);
        if (unlockedAchievement.coinReward > 0) {
          player.addCoin(unlockedAchievement.coinReward);
        }
        notifications.add(`ACHIEVEMENT UNLOCKED: ${unlockedAchievement.name}`, 'achievement', undefined, 5000);
      }

      return next;
    });
  }

  return {
    subscribe,
    unlock: (id: string) => {
      const achievement = currentAchievements.find(item => item.id === id);
      if (!achievement || achievement.unlocked) return;

      unlockInternal(id);
    },
    sync: (getState: () => AchievementSyncState) => {
      let processedIds = new Set<string>();

      while (true) {
        const state = getState();
        const unlockable = currentAchievements.filter(achievement => {
          return !achievement.unlocked && !processedIds.has(achievement.id) && shouldUnlockAchievement(achievement, state);
        });

        if (unlockable.length === 0) break;

        unlockable.forEach(achievement => {
          processedIds.add(achievement.id);
          unlockInternal(achievement.id);
        });
      }
    },
    reset: () => {
      if (browser) localStorage.removeItem('arcade_achievements');
      set([...ACHIEVEMENTS]);
      currentAchievements = [...ACHIEVEMENTS];
    }
  };
}

export const achievements = createAchievementsStore();

if (browser) {
  achievements.subscribe(val => {
    localStorage.setItem('arcade_achievements', JSON.stringify(val));
  });
}

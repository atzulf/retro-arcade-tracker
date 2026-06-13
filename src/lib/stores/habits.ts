import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Habit } from '../types';
import { getTodayISO } from '../utils/date';
import { player } from './player';
import { notifications } from './notifications';
import { getStreakMultiplier, getStreakLabel } from '../utils/streak';
import { achievements } from './achievements';
import { tasks } from './tasks';
import { pomodoro } from './pomodoro';
import { get } from 'svelte/store';

function createHabitsStore() {
  const stored = browser ? localStorage.getItem('arcade_habits') : null;
  let initial: Habit[] = [];
  if (stored) {
    try {
      initial = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse habits data', e);
    }
  }
  
  const { subscribe, update, set } = writable<Habit[]>(initial);

  return {
    subscribe,
    add: (habit: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'completedDates' | 'createdAt' | 'isActive'>) => {
      const newHabit: Habit = {
        ...habit,
        id: crypto.randomUUID(),
        streak: 0,
        bestStreak: 0,
        completedDates: [],
        createdAt: new Date().toISOString(),
        isActive: true
      };
      update(h => [...h, newHabit]);
    },
    update: (id: string, data: Partial<Habit>) => {
      update(h => h.map(item => item.id === id ? { ...item, ...data } : item));
    },
    remove: (id: string) => {
      update(h => h.filter(item => item.id !== id));
    },
    complete: (id: string) => {
      update(h => {
        return h.map(item => {
          if (item.id === id) {
            const today = getTodayISO();
            if (item.completedDates.includes(today)) return item; // Already completed today

            const newCompletedDates = [...item.completedDates, today];
            const newStreak = item.streak + 1;
            const newBestStreak = Math.max(item.bestStreak, newStreak);
            
            // Calculate rewards
            const multiplier = getStreakMultiplier(newStreak);
            const xpEarned = Math.floor(item.xpReward * multiplier);
            const coinsEarned = Math.floor(item.coinReward * multiplier);
            
            player.addXP(xpEarned);
            player.addCoin(coinsEarned);
            
            notifications.add(`+${xpEarned} XP`, 'xp');
            
            const streakLabel = getStreakLabel(newStreak);
            if (streakLabel) {
              notifications.add(streakLabel, 'streak');
            }

            return {
              ...item,
              streak: newStreak,
              bestStreak: newBestStreak,
              completedDates: newCompletedDates
            };
          }
          return item;
        });
      });

      queueMicrotask(() => {
        achievements.sync(() => ({
          player: get(player),
          habits: get(habits),
          tasks: get(tasks),
          pomodoroSessions: get(pomodoro).sessions
        }));
      });
    },
    reset: () => {
      if (browser) localStorage.removeItem('arcade_habits');
      set([]);
    }
  };
}

export const habits = createHabitsStore();

if (browser) {
  habits.subscribe(val => {
    localStorage.setItem('arcade_habits', JSON.stringify(val));
  });
}

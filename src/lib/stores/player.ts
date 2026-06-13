import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Player } from '../types';
import { checkLevelUp } from '../utils/xp';
import { notifications } from './notifications';
import { achievements } from './achievements';
import { habits } from './habits';
import { tasks } from './tasks';
import { pomodoro } from './pomodoro';
import { get } from 'svelte/store';

const DEFAULT_PLAYER: Player = {
  name: 'PLAYER 1',
  level: 1, 
  xp: 0, 
  xpToNextLevel: 100, 
  totalXp: 0,
  coins: 0, 
  hp: 100, 
  maxHp: 100,
  weeklyXp: 0, 
  createdAt: new Date().toISOString()
};

function createPlayerStore() {
  const stored = browser ? localStorage.getItem('arcade_player') : null;
  let initial: Player = DEFAULT_PLAYER;
  if (stored) {
    try {
      initial = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse player data', e);
    }
  }
  
  const { subscribe, update, set } = writable<Player>(initial);

  return {
    subscribe,
    addXP: (amount: number) => update(p => {
      let next = { ...p };
      next.xp += amount;
      next.totalXp += amount;
      next.weeklyXp += amount;
      
      const { leveled, newLevel } = checkLevelUp(next);
      if (leveled) {
        next.level = newLevel;
        notifications.add(`LEVEL UP! You are now level ${newLevel}!`, 'level_up');
      }

      queueMicrotask(() => {
        achievements.sync(() => ({
          player: get(player),
          habits: get(habits),
          tasks: get(tasks),
          pomodoroSessions: get(pomodoro).sessions
        }));
      });

      return next;
    }),
    addCoin: (amount: number) => update(p => {
      const next = { ...p, coins: p.coins + amount };
      notifications.add(`+${amount} COIN`, 'coin');

      queueMicrotask(() => {
        achievements.sync(() => ({
          player: get(player),
          habits: get(habits),
          tasks: get(tasks),
          pomodoroSessions: get(pomodoro).sessions
        }));
      });

      return next;
    }),
    takeDamage: (amount: number) => update(p => {
      notifications.add(`-${amount} HP`, 'error');
      return { ...p, hp: Math.max(0, p.hp - amount) };
    }),
    heal: (amount: number) => update(p => ({ ...p, hp: Math.min(p.maxHp, p.hp + amount) })),
    setName: (name: string) => update(p => ({ ...p, name })),
    reset: () => {
      if (browser) localStorage.removeItem('arcade_player');
      set(DEFAULT_PLAYER);
    }
  };
}

export const player = createPlayerStore();

if (browser) {
  player.subscribe(val => {
    localStorage.setItem('arcade_player', JSON.stringify(val));
  });

  queueMicrotask(() => {
    achievements.sync(() => ({
      player: get(player),
      habits: get(habits),
      tasks: get(tasks),
      pomodoroSessions: get(pomodoro).sessions
    }));
  });
}

import type { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  // STREAK
  { id: 'streak_3',  name: 'COMBO STARTER', description: '3 hari streak!',   icon: '⚡', category: 'streak',   condition: { type: 'streak', value: 3  }, xpReward: 50,  coinReward: 30,  rarity: 'common',    unlocked: false },
  { id: 'streak_7',  name: 'WEEK WARRIOR',  description: '7 hari streak!',   icon: '🔥', category: 'streak',   condition: { type: 'streak', value: 7  }, xpReward: 100, coinReward: 70,  rarity: 'rare',      unlocked: false },
  { id: 'streak_14', name: 'EPIC GRINDER',  description: '14 hari streak!',  icon: '💎', category: 'streak',   condition: { type: 'streak', value: 14 }, xpReward: 200, coinReward: 150, rarity: 'epic',      unlocked: false },
  { id: 'streak_30', name: 'LEGENDARY',     description: '30 hari streak!',  icon: '👑', category: 'streak',   condition: { type: 'streak', value: 30 }, xpReward: 500, coinReward: 500, rarity: 'legendary', unlocked: false },
  
  // LEVEL
  { id: 'level_5',   name: 'LEVEL 5 HERO',  description: 'Capai level 5!',   icon: '⚔️', category: 'level',    condition: { type: 'level', value: 5   }, xpReward: 100, coinReward: 100, rarity: 'common',    unlocked: false },
  { id: 'level_10',  name: 'VETERAN',       description: 'Capai level 10!',  icon: '🛡️', category: 'level',    condition: { type: 'level', value: 10  }, xpReward: 200, coinReward: 200, rarity: 'rare',      unlocked: false },
  
  // COINS
  { id: 'coins_100', name: 'COIN COLLECTOR', description: '100 coin terkumpul!', icon: '🪙', category: 'coins', condition: { type: 'total_coins', value: 100 }, xpReward: 50, coinReward: 0, rarity: 'common', unlocked: false },
  
  // TASKS
  { id: 'tasks_10',  name: 'TASK SLAYER',    description: 'Selesaikan 10 task!', icon: '✅', category: 'tasks', condition: { type: 'tasks_completed', value: 10 }, xpReward: 80, coinReward: 50, rarity: 'common', unlocked: false },
  
  // POMODORO
  { id: 'pomo_10',   name: 'FOCUS MASTER',   description: '10 sesi pomodoro!',  icon: '🍅', category: 'pomodoro', condition: { type: 'pomodoro_sessions', value: 10 }, xpReward: 100, coinReward: 80, rarity: 'rare', unlocked: false },
  
  // SPECIAL
  { id: 'first_habit', name: 'GAME START',   description: 'Buat habit pertama!', icon: '🎮', category: 'special', condition: { type: 'habits_completed', value: 1 }, xpReward: 30, coinReward: 20, rarity: 'common', unlocked: false },
];

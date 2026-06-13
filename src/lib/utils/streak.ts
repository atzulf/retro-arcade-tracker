import type { Habit } from '../types';

export function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return 3.0;   // 🔥🔥🔥 LEGENDARY
  if (streak >= 14) return 2.5;   // 🔥🔥 EPIC
  if (streak >= 7)  return 2.0;   // 🔥 GREAT
  if (streak >= 3)  return 1.5;   // ⚡ COMBO
  return 1.0;
}

export function getStreakLabel(streak: number): string {
  if (streak >= 30) return 'LEGENDARY STREAK!';
  if (streak >= 14) return 'EPIC COMBO!';
  if (streak >= 7)  return 'ON FIRE!';
  if (streak >= 3)  return 'COMBO x' + streak + '!';
  return '';
}

export function isCompletedToday(habit: Habit): boolean {
  const today = new Date().toISOString().split('T')[0];
  return habit.completedDates.includes(today);
}

export function isStreakValid(habit: Habit): boolean {
  if (habit.completedDates.length === 0) return false;
  
  // A streak is valid if it was completed today or yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];
  
  return habit.completedDates.includes(yStr) || habit.completedDates.includes(today);
}

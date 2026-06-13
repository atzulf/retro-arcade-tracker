export interface Player {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  coins: number;
  hp: number;
  maxHp: number;
  weeklyXp: number;          // reset tiap Senin
  createdAt: string;         // ISO date string
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;              // emoji atau nama pixel icon
  category: 'health' | 'learning' | 'work' | 'social' | 'custom';
  frequency: 'daily' | 'weekdays' | 'weekends' | 'custom';
  customDays?: number[];     // 0=Minggu, 1=Senin, ..., 6=Sabtu
  coinReward: number;        // coin didapat saat selesai
  xpReward: number;          // XP didapat saat selesai
  streak: number;            // hari berturut-turut
  bestStreak: number;
  completedDates: string[];  // array ISO date string
  createdAt: string;
  isActive: boolean;
}

export type TaskPriority = 'easy' | 'medium' | 'hard';

export interface Task {
  id: string;
  date: string;              // ISO date string (YYYY-MM-DD)
  title: string;
  description?: string;
  priority: TaskPriority;
  deadline?: string;         // ISO date string (YYYY-MM-DD)
  coinReward: number;
  xpReward: number;
  completed: boolean;
  completedAt?: string;
  linkedHabitId?: string;    // opsional: terhubung ke habit tertentu
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;              // emoji
  category: 'streak' | 'coins' | 'level' | 'tasks' | 'pomodoro' | 'special';
  condition: AchievementCondition;
  xpReward: number;
  coinReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface AchievementCondition {
  type: 'streak' | 'total_coins' | 'level' | 'tasks_completed' |
        'pomodoro_sessions' | 'habits_completed' | 'days_active';
  value: number;
  habitId?: string;          // jika kondisi spesifik ke satu habit
}

export interface PomodoroSession {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  duration: number;          // menit (default 25)
  breakDuration: number;     // menit (default 5)
  completed: boolean;
  linkedTaskId?: string;
  linkedHabitId?: string;
  coinReward: number;
  xpReward: number;
}

export interface PomodoroConfig {
  workDuration: number;      // default: 25
  shortBreak: number;        // default: 5
  longBreak: number;         // default: 15
  sessionsBeforeLongBreak: number; // default: 4
}

export interface Notification {
  id: string;
  type: 'coin' | 'xp' | 'level_up' | 'achievement' | 'streak' | 'combo' | 'error' | 'info';
  message: string;
  value?: number;
  duration: number;          // ms
}

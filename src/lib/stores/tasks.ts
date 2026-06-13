import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Task, TaskPriority } from '../types';
import { player } from './player';
import { notifications } from './notifications';
import { TASK_COIN_REWARDS, TASK_XP_REWARDS } from '../utils/xp';
import { achievements } from './achievements';
import { habits } from './habits';
import { pomodoro } from './pomodoro';
import { get } from 'svelte/store';

function normalizePriority(priority: unknown): TaskPriority {
  if (priority === 'easy' || priority === 'medium' || priority === 'hard') return priority;
  if (priority === 'low') return 'easy';
  if (priority === 'high' || priority === 'boss') return 'hard';
  return 'medium';
}

function normalizeTask(raw: any): Task | null {
  if (!raw || typeof raw !== 'object') return null;
  if (typeof raw.id !== 'string' || typeof raw.date !== 'string' || typeof raw.title !== 'string') return null;

  const priority = normalizePriority(raw.priority);
  const deadline = typeof raw.deadline === 'string' && raw.deadline.trim() ? raw.deadline : undefined;

  return {
    ...raw,
    priority,
    deadline,
    completed: Boolean(raw.completed),
    coinReward: TASK_COIN_REWARDS[priority],
    xpReward: TASK_XP_REWARDS[priority]
  };
}

function createTasksStore() {
  const stored = browser ? localStorage.getItem('arcade_tasks') : null;
  let initial: Task[] = [];
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        initial = parsed.map(normalizeTask).filter((task): task is Task => task !== null);
      }
    } catch (e) {
      console.error('Failed to parse tasks data', e);
    }
  }
  
  const { subscribe, update, set } = writable<Task[]>(initial);

  return {
    subscribe,
    add: (task: Omit<Task, 'id' | 'completed' | 'coinReward' | 'xpReward'>) => {
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        completed: false,
        coinReward: TASK_COIN_REWARDS[task.priority],
        xpReward: TASK_XP_REWARDS[task.priority]
      };
      update(t => [...t, newTask]);
    },
    update: (id: string, data: Partial<Task>) => {
      update(t => t.map(item => item.id === id ? { ...item, ...data } : item));
    },
    remove: (id: string) => {
      update(t => t.filter(item => item.id !== id));
    },
    complete: (id: string) => {
      update(t => {
        return t.map(item => {
          if (item.id === id && !item.completed) {
            player.addXP(item.xpReward);
            player.addCoin(item.coinReward);
            notifications.add(`+${item.xpReward} XP`, 'xp');
            return {
              ...item,
              completed: true,
              completedAt: new Date().toISOString()
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
      if (browser) localStorage.removeItem('arcade_tasks');
      set([]);
    }
  };
}

export const tasks = createTasksStore();

if (browser) {
  tasks.subscribe(val => {
    localStorage.setItem('arcade_tasks', JSON.stringify(val));
  });
}

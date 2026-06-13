import { derived, writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { PomodoroSession, PomodoroConfig } from '../types';
import { player } from './player';
import { notifications } from './notifications';
import { POMODORO_COIN, POMODORO_XP } from '../utils/xp';
import { achievements } from './achievements';
import { habits } from './habits';
import { tasks } from './tasks';
import { get } from 'svelte/store';

const DEFAULT_CONFIG: PomodoroConfig = {
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsBeforeLongBreak: 4
};

function createPomodoroStore() {
  const storedSessions = browser ? localStorage.getItem('arcade_pomodoro_sessions') : null;
  let initialSessions: PomodoroSession[] = [];
  if (storedSessions) {
    try {
      initialSessions = JSON.parse(storedSessions);
    } catch (e) {
      console.error('Failed to parse pomodoro sessions', e);
    }
  }
  
  const storedConfig = browser ? localStorage.getItem('arcade_pomodoro_config') : null;
  let initialConfig: PomodoroConfig = DEFAULT_CONFIG;
  if (storedConfig) {
    try {
      initialConfig = JSON.parse(storedConfig);
    } catch (e) {
      console.error('Failed to parse pomodoro config', e);
    }
  }

  const { subscribe: subscribeSessions, update: updateSessions, set: setSessions } = writable<PomodoroSession[]>(initialSessions);
  const { subscribe: subscribeConfig, update: updateConfig, set: setConfig } = writable<PomodoroConfig>(initialConfig);
  const subscribe = derived(
    [
      { subscribe: subscribeSessions },
      { subscribe: subscribeConfig }
    ],
    ([sessions, config]) => ({ sessions, config })
  ).subscribe;

  return {
    subscribe,
    sessions: {
      subscribe: subscribeSessions,
      add: (session: Omit<PomodoroSession, 'id' | 'coinReward' | 'xpReward'>) => {
        const newSession: PomodoroSession = {
          ...session,
          id: crypto.randomUUID(),
          coinReward: POMODORO_COIN,
          xpReward: POMODORO_XP
        };
        
        if (newSession.completed) {
          player.addXP(POMODORO_XP);
          player.addCoin(POMODORO_COIN);
          notifications.add(`FOCUS COMPLETE! +${POMODORO_XP} XP`, 'xp');
        }
        
        updateSessions(s => [...s, newSession]);

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
        if (browser) localStorage.removeItem('arcade_pomodoro_sessions');
        setSessions([]);
      }
    },
    config: {
      subscribe: subscribeConfig,
      update: (cfg: Partial<PomodoroConfig>) => updateConfig(c => ({ ...c, ...cfg })),
      reset: () => {
        if (browser) localStorage.removeItem('arcade_pomodoro_config');
        setConfig(DEFAULT_CONFIG);
      }
    }
  };
}

export const pomodoro = createPomodoroStore();

if (browser) {
  pomodoro.sessions.subscribe(val => {
    localStorage.setItem('arcade_pomodoro_sessions', JSON.stringify(val));
  });
  pomodoro.config.subscribe(val => {
    localStorage.setItem('arcade_pomodoro_config', JSON.stringify(val));
  });
}

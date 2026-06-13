import { writable } from 'svelte/store';
import type { Notification } from '../types';

function createNotificationsStore() {
  const { subscribe, update } = writable<Notification[]>([]);

  return {
    subscribe,
    add: (message: string, type: Notification['type'] = 'info', value?: number, duration = 3000) => {
      const id = crypto.randomUUID();
      const notification: Notification = { id, type, message, value, duration };
      
      update(n => [...n, notification]);
      
      setTimeout(() => {
        update(n => n.filter(item => item.id !== id));
      }, duration);
    },
    remove: (id: string) => update(n => n.filter(item => item.id !== id))
  };
}

export const notifications = createNotificationsStore();

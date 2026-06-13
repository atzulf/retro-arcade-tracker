<script lang="ts">
  import { notifications } from '../../stores/notifications';
  import { fly } from 'svelte/transition';

  const typeStyles = {
    info: 'border-neon-cyan text-neon-cyan',
    coin: 'border-accent-amber text-accent-amber',
    xp: 'border-neon-cyan text-neon-cyan',
    level_up: 'border-accent-orange text-accent-orange font-bold neon-text-orange',
    achievement: 'border-accent-amber text-accent-amber bg-bg-secondary/90',
    streak: 'border-accent-orange text-accent-orange',
    combo: 'border-accent-red text-accent-red',
    error: 'border-accent-red text-accent-red'
  };

  const typeIcons = {
    info: '💬',
    coin: '🪙',
    xp: '✨',
    level_up: '⬆️',
    achievement: '🏆',
    streak: '🔥',
    combo: '⚡',
    error: '❌'
  };
</script>

<div class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
  {#each $notifications as notification (notification.id)}
    <div 
      transition:fly={{ y: 20, duration: 300 }}
      class="pixel-border bg-bg-primary p-3 flex items-center gap-3 {typeStyles[notification.type]}"
    >
      <span class="text-xl">{typeIcons[notification.type]}</span>
      <span class="font-body text-lg pt-1">{notification.message}</span>
    </div>
  {/each}
</div>

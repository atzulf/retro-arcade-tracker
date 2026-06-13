<script lang="ts">
  import { tasks } from '../../stores/tasks';
  import TaskItem from './TaskItem.svelte';
  import PixelButton from '../ui/PixelButton.svelte';

  let { 
    date = '',
    onAddQuest
  } = $props<{
    date: string,
    onAddQuest: () => void
  }>();

  let dayTasks = $derived($tasks.filter(t => t.date === date));
  
  let sortedTasks = $derived([...dayTasks].sort((a, b) => {
    // Sort by completion first
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const aDeadline = a.deadline ? new Date(a.deadline).getTime() : Number.POSITIVE_INFINITY;
    const bDeadline = b.deadline ? new Date(b.deadline).getTime() : Number.POSITIVE_INFINITY;
    if (aDeadline !== bDeadline) return aDeadline - bDeadline;

    // Then by priority (hard -> medium -> easy)
    const pWeight = { hard: 3, medium: 2, easy: 1 };
    return pWeight[b.priority] - pWeight[a.priority];
  }));
</script>

<div class="flex flex-col h-full">
  <div class="flex items-center justify-between mb-4">
    <h2 class="font-display text-accent-orange neon-text-orange text-sm truncate pr-2">
      TO DO LIST - {date}
    </h2>
    <PixelButton size="sm" onclick={onAddQuest}>+ ADD</PixelButton>
  </div>

  <div class="flex-grow overflow-y-auto pr-2 custom-scrollbar">
    {#if sortedTasks.length === 0}
      <div class="h-32 flex flex-col items-center justify-center text-text-dim border-2 border-dashed border-border-arcade p-4 text-center">
        <span class="text-2xl mb-2 grayscale opacity-50">🎮</span>
        <p class="font-body">NO QUESTS FOR THIS DAY</p>
      </div>
    {:else}
      {#each sortedTasks as task (task.id)}
        <TaskItem {task} />
      {/each}
    {/if}
  </div>
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: var(--color-bg-primary);
    border-left: 1px solid var(--color-border);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-accent-orange);
  }
</style>

<script lang="ts">
  import type { Task } from '../../types';
  import { tasks } from '../../stores/tasks';
  
  let { task } = $props<{ task: Task }>();
  
  const priorityColors = {
    easy: 'text-neon-green border-neon-green',
    medium: 'text-accent-amber border-accent-amber',
    hard: 'text-accent-red border-accent-red'
  };

  const priorityLabels = {
    easy: 'EASY',
    medium: 'MEDIUM',
    hard: 'HARD'
  };

  function formatDeadline(deadline: string) {
    return new Date(`${deadline}T00:00:00`).toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  }

  function toggle() {
    if (!task.completed) {
      tasks.complete(task.id);
    }
  }

  function remove() {
    tasks.remove(task.id);
  }
</script>

<div class="flex items-start gap-3 p-3 bg-bg-secondary border-2 border-border-arcade mb-2 group">
  <button 
    class="w-6 h-6 mt-1 flex-shrink-0 flex items-center justify-center pixel-border {task.completed ? 'bg-neon-green border-neon-green' : 'bg-bg-primary'} transition-colors"
    onclick={toggle}
    disabled={task.completed}
  >
    {#if task.completed}
      <span class="text-bg-primary text-sm font-bold block translate-y-[-1px]">✓</span>
    {/if}
  </button>
  
  <div class="flex-grow">
    <div class="flex items-start justify-between gap-2">
      <h4 class="font-body text-lg {task.completed ? 'line-through text-text-dim' : 'text-text-primary'}">
        {task.title}
      </h4>
      <div class="flex items-center gap-2">
        <span class="text-[10px] uppercase px-1 border {priorityColors[task.priority]} font-display tracking-tighter">
          {priorityLabels[task.priority]}
        </span>
        <button 
          class="text-text-dim hover:text-accent-red opacity-0 group-hover:opacity-100 transition-opacity"
          onclick={remove}
          aria-label="Delete Task"
        >
          ×
        </button>
      </div>
    </div>
    
    {#if task.description && !task.completed}
      <p class="text-sm font-body text-text-dim mt-1">{task.description}</p>
    {/if}

    {#if task.deadline && !task.completed}
      <div class="mt-1 text-xs font-display text-text-dim">
        DEADLINE: <span class="text-accent-orange">{formatDeadline(task.deadline)}</span>
      </div>
    {/if}
    
    <div class="flex gap-3 mt-2 text-xs font-display">
      <span class="text-accent-amber">+{task.coinReward}C</span>
      <span class="text-neon-cyan">+{task.xpReward}XP</span>
    </div>
  </div>
</div>

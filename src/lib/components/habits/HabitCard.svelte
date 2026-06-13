<script lang="ts">
  import type { Habit } from '../../types';
  import { habits } from '../../stores/habits';
  import { getTodayISO, getWeekDates, formatISO } from '../../utils/date';
  import PixelButton from '../ui/PixelButton.svelte';
  import StreakCounter from './StreakCounter.svelte';
  import PixelCard from '../ui/PixelCard.svelte';
  
  let { habit } = $props<{ habit: Habit }>();
  
  let isCompletedToday = $derived(habit.completedDates.includes(getTodayISO()));
  
  function completeHabit() {
    habits.complete(habit.id);
  }

  // Calculate the past 7 days for the progress bar
  let past7Days = $derived(() => {
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const iso = formatISO(d);
      days.push({
        date: iso,
        completed: habit.completedDates.includes(iso)
      });
    }
    return days;
  });
</script>

<PixelCard class="flex flex-col h-full">
  <div class="flex items-start justify-between mb-4">
    <div class="flex items-center gap-3">
      <div class="text-3xl">{habit.icon}</div>
      <div>
        <h3 class="font-display text-sm truncate max-w-[150px] sm:max-w-[200px]" title={habit.name}>
          {habit.name}
        </h3>
        <div class="text-text-dim font-body text-sm mt-1">
          {habit.category.toUpperCase()}
        </div>
      </div>
    </div>
    
    <StreakCounter streak={habit.streak} bestStreak={habit.bestStreak} />
  </div>

  <div class="flex-grow">
    <!-- 7 Day Progress -->
    <div class="mb-4">
      <div class="text-xs font-body text-text-dim mb-1">LAST 7 DAYS</div>
      <div class="flex gap-1">
        {#each past7Days() as day}
          <div 
            class="w-full h-4 border border-border-arcade {day.completed ? 'bg-neon-green shadow-[0_0_5px_#39ff14]' : 'bg-bg-primary'}"
            title={day.date}
          ></div>
        {/each}
      </div>
    </div>
    
    <!-- Rewards -->
    <div class="flex gap-4 font-body text-sm mb-4">
      <span class="text-accent-amber">+{habit.coinReward} COIN</span>
      <span class="text-neon-cyan">+{habit.xpReward} XP</span>
    </div>
  </div>

  {#if isCompletedToday}
    <PixelButton variant="success" class="w-full pointer-events-none" disabled>
      DONE ✓
    </PixelButton>
  {:else}
    <PixelButton variant="primary" class="w-full" onclick={completeHabit}>
      COMPLETE
    </PixelButton>
  {/if}
</PixelCard>

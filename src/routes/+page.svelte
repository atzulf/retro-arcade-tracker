<script lang="ts">
  import { player } from '../lib/stores/player';
  import { habits } from '../lib/stores/habits';
  import { tasks } from '../lib/stores/tasks';
  import { achievements } from '../lib/stores/achievements';
  import { getTodayISO } from '../lib/utils/date';
  import HabitCard from '../lib/components/habits/HabitCard.svelte';
  import DayTaskList from '../lib/components/tasks/DayTaskList.svelte';
  import PixelCard from '../lib/components/ui/PixelCard.svelte';
  import DatePickerField from '../lib/components/ui/DatePickerField.svelte';
  import PomodoroTimer from '../lib/components/pomodoro/PomodoroTimer.svelte';
  import Modal from '../lib/components/ui/Modal.svelte';
  import PixelButton from '../lib/components/ui/PixelButton.svelte';

  let today = getTodayISO();
  let activeHabits = $derived($habits.filter((h: any) => h.isActive));
  let pendingHabits = $derived(activeHabits.filter((h: any) => !h.completedDates.includes(today)));
  let completedHabits = $derived(activeHabits.filter((h: any) => h.completedDates.includes(today)));
  
  let todayTasks = $derived($tasks.filter((t: any) => t.date === today));
  let unlockedAchievements = $derived($achievements.filter((a: any) => a.unlocked).sort((a: any, b: any) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime()).slice(0, 3));

  let maxStreak = $derived($habits.reduce((max: number, h: any) => Math.max(max, h.streak), 0));

  let showTaskModal = $state(false);
  let newTaskTitle = $state('');
  let newTaskDescription = $state('');
  let newTaskPriority = $state<'easy' | 'medium' | 'hard'>('medium');
  let newTaskDeadline = $state('');

  function quickAddTask() {
    if (!newTaskTitle.trim()) return;
    tasks.add({
      title: newTaskTitle,
      description: newTaskDescription,
      date: today,
      priority: newTaskPriority,
      deadline: newTaskDeadline || undefined
    });
    newTaskTitle = '';
    newTaskDescription = '';
    newTaskDeadline = '';
    newTaskPriority = 'medium';
    showTaskModal = false;
  }
</script>

<svelte:head>
  <title>LEVL UP - Arcade Tracker</title>
</svelte:head>

<div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
  
  <!-- Left Column (60%) -->
  <div class="lg:col-span-7 flex flex-col gap-6">
    
    <!-- Greeting & Summary -->
    <PixelCard class="flex flex-wrap gap-4 items-center justify-between">
      <div>
        <h2 class="font-display text-xl text-text-primary mb-2">
          READY, <span class="text-accent-orange neon-text-orange animate-blink">{$player.name}</span>?
        </h2>
        <p class="font-body text-text-dim">Your daily quests await.</p>
      </div>
      <div class="flex gap-4 font-body text-sm">
        <div class="text-center">
          <div class="text-text-dim">ACTIVE HABITS</div>
          <div class="text-xl text-neon-cyan">{activeHabits.length}</div>
        </div>
        <div class="text-center">
          <div class="text-text-dim">MAX STREAK</div>
          <div class="text-xl text-accent-red">🔥 {maxStreak}</div>
        </div>
      </div>
    </PixelCard>

    <!-- Today's Habits -->
    <div>
      <div class="flex items-center justify-between mb-4 border-b-2 border-border-arcade pb-2">
        <h3 class="font-display text-accent-orange neon-text-orange">TODAY'S HABITS</h3>
        <span class="font-body text-text-dim">{completedHabits.length}/{activeHabits.length} DONE</span>
      </div>
      
      {#if pendingHabits.length === 0 && completedHabits.length > 0}
        <div class="pixel-border bg-[#0f331b] p-8 text-center border-neon-green">
          <span class="text-4xl mb-4 block text-neon-green">🏆</span>
          <h4 class="font-display text-neon-green neon-text-green mb-2">ALL CLEAR!</h4>
          <p class="font-body text-text-dim">You completed all habits for today.</p>
        </div>
      {:else if activeHabits.length === 0}
        <div class="arcade-panel p-8 text-center border-dashed border-text-dim text-text-dim">
          <p class="font-body mb-4">No habits created yet.</p>
          <a href="/habits" class="inline-block text-accent-amber hover:underline font-body uppercase">Go to Habit Board ➔</a>
        </div>
      {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {#each pendingHabits as habit (habit.id)}
            <HabitCard {habit} />
          {/each}
          {#each completedHabits as habit (habit.id)}
            <div class="opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
              <HabitCard {habit} />
            </div>
          {/each}
        </div>
      {/if}
    </div>

  </div>

  <!-- Right Column (40%) -->
  <div class="lg:col-span-5 flex flex-col gap-6">
    
    <!-- Quick Pomodoro -->
    <PixelCard title="QUICK FOCUS">
      <div class="scale-90 origin-top">
        <PomodoroTimer />
      </div>
    </PixelCard>

    <!-- Today's Tasks -->
    <PixelCard class="flex-grow min-h-[300px]">
      <DayTaskList 
        date={today} 
        onAddQuest={() => showTaskModal = true} 
      />
    </PixelCard>

    <!-- Recent Achievements -->
    {#if unlockedAchievements.length > 0}
      <PixelCard title="LATEST UNLOCKS">
        <div class="flex flex-col gap-3">
          {#each unlockedAchievements as achievement}
            <div class="flex items-center gap-3 bg-bg-primary border border-border-arcade p-2">
              <span class="text-2xl">{achievement.icon}</span>
              <div>
                <div class="font-display text-[10px] text-accent-amber">{achievement.name}</div>
                <div class="font-body text-text-dim text-sm">{achievement.description}</div>
              </div>
            </div>
          {/each}
        </div>
      </PixelCard>
    {/if}

  </div>
</div>

<Modal bind:show={showTaskModal} title="ADD QUICK QUEST">
  <form onsubmit={(e) => { e.preventDefault(); quickAddTask(); }} class="flex flex-col gap-4">
    <div class="flex flex-col gap-1">
      <label for="title" class="text-text-dim text-sm font-body uppercase">Quest Title</label>
      <!-- svelte-ignore a11y_autofocus -->
      <input 
        id="title" 
        bind:value={newTaskTitle} 
        class="pixel-border bg-bg-primary text-text-primary p-2 font-body focus:outline-none focus:border-neon-cyan"
        placeholder="e.g., Buy groceries"
        required
        autofocus
      />
    </div>
    <div class="flex flex-col gap-1">
      <label for="description" class="text-text-dim text-sm font-body uppercase">Description (Optional)</label>
      <textarea
        id="description"
        bind:value={newTaskDescription}
        class="pixel-border bg-bg-primary text-text-primary p-2 font-body focus:outline-none focus:border-neon-cyan h-20"
        placeholder="Add extra details for this quest"
      ></textarea>
    </div>
    <DatePickerField
      id="deadline"
      label="Deadline (Optional)"
      placeholder="Pick a deadline"
      bind:value={newTaskDeadline}
    />
    <div class="flex flex-col gap-1">
      <label for="priority" class="text-text-dim text-sm font-body uppercase">Priority</label>
      <select id="priority" bind:value={newTaskPriority} class="pixel-border bg-bg-primary text-text-primary p-2 font-body focus:outline-none focus:border-neon-cyan">
        <option value="easy">EASY</option>
        <option value="medium">MEDIUM</option>
        <option value="hard">HARD</option>
      </select>
    </div>
    <PixelButton type="submit" class="mt-2">ADD TO TODAY</PixelButton>
  </form>
</Modal>

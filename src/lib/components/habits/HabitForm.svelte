<script lang="ts">
  import { habits } from '../../stores/habits';
  import PixelButton from '../ui/PixelButton.svelte';
  import type { Habit } from '../../types';
  import { HABIT_BASE_COIN, HABIT_BASE_XP } from '../../utils/xp';

  let { 
    onclose, 
    habitToEdit = null 
  } = $props<{ 
    onclose: () => void, 
    habitToEdit?: Habit | null 
  }>();

  let name = $state(habitToEdit?.name || '');
  let icon = $state(habitToEdit?.icon || '🎮');
  let category = $state<Habit['category']>(habitToEdit?.category || 'health');
  let frequency = $state<Habit['frequency']>(habitToEdit?.frequency || 'daily');
  
  const emojis = ['🎮', '📚', '🏋️', '💧', '🥗', '🧘', '💻', '🎸', '🎨', '🧹', '🚶', '🛌'];

  function save() {
    if (!name.trim()) return;
    
    if (habitToEdit) {
      habits.update(habitToEdit.id, { name, icon, category, frequency });
    } else {
      habits.add({
        name,
        icon,
        category,
        frequency,
        coinReward: HABIT_BASE_COIN,
        xpReward: HABIT_BASE_XP
      });
    }
    onclose();
  }
</script>

<form class="flex flex-col gap-4 font-body" onsubmit={(e) => { e.preventDefault(); save(); }}>
  <div class="flex flex-col gap-1">
    <label for="name" class="text-text-dim text-sm uppercase">Habit Name</label>
    <input 
      type="text" 
      id="name" 
      bind:value={name} 
      class="pixel-border bg-bg-primary text-text-primary p-2 focus:outline-none focus:border-neon-cyan"
      placeholder="e.g., Drink Water"
      required
      maxlength="30"
    />
  </div>

  <div class="flex flex-col gap-1">
    <label class="text-text-dim text-sm uppercase">Icon</label>
    <div class="flex flex-wrap gap-2">
      {#each emojis as e}
        <button 
          type="button" 
          class="w-10 h-10 flex items-center justify-center text-xl pixel-border {icon === e ? 'bg-accent-orange border-white' : 'bg-bg-primary border-border-arcade'}"
          onclick={() => icon = e}
        >
          {e}
        </button>
      {/each}
    </div>
  </div>

  <div class="flex gap-4">
    <div class="flex flex-col gap-1 flex-1">
      <label for="category" class="text-text-dim text-sm uppercase">Category</label>
      <select id="category" bind:value={category} class="pixel-border bg-bg-primary text-text-primary p-2 focus:outline-none">
        <option value="health">Health</option>
        <option value="learning">Learning</option>
        <option value="work">Work</option>
        <option value="social">Social</option>
        <option value="custom">Custom</option>
      </select>
    </div>

    <div class="flex flex-col gap-1 flex-1">
      <label for="frequency" class="text-text-dim text-sm uppercase">Frequency</label>
      <select id="frequency" bind:value={frequency} class="pixel-border bg-bg-primary text-text-primary p-2 focus:outline-none">
        <option value="daily">Daily</option>
        <option value="weekdays">Weekdays</option>
        <option value="weekends">Weekends</option>
      </select>
    </div>
  </div>

  <div class="mt-4 flex gap-4">
    <PixelButton type="button" variant="secondary" class="flex-1" onclick={onclose}>CANCEL</PixelButton>
    <PixelButton type="submit" variant="primary" class="flex-1">SAVE</PixelButton>
  </div>
</form>

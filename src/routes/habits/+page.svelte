<script lang="ts">
  import { habits } from '../../lib/stores/habits';
  import HabitCard from '../../lib/components/habits/HabitCard.svelte';
  import HabitForm from '../../lib/components/habits/HabitForm.svelte';
  import Modal from '../../lib/components/ui/Modal.svelte';
  import PixelButton from '../../lib/components/ui/PixelButton.svelte';

  let showModal = $state(false);

  let activeHabits = $derived($habits.filter((h: any) => h.isActive));
</script>

<svelte:head>
  <title>Habit Quest Board - Arcade Tracker</title>
</svelte:head>

<div class="flex flex-col gap-6">
  
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-border-arcade pb-4">
    <div>
      <h1 class="font-display text-2xl text-accent-orange neon-text-orange mb-2">HABIT QUEST BOARD</h1>
      <p class="font-body text-text-dim">Build discipline, earn rewards, level up your life.</p>
    </div>
    <PixelButton size="lg" onclick={() => showModal = true}>
      + ADD HABIT
    </PixelButton>
  </div>

  {#if activeHabits.length === 0}
    <div class="arcade-panel flex flex-col items-center justify-center py-20 px-4 text-center border-dashed border-text-dim text-text-dim">
      <span class="text-6xl mb-4 grayscale opacity-50">🎯</span>
      <h2 class="font-display text-lg mb-2">NO HABITS YET</h2>
      <p class="font-body max-w-md">The journey of a thousand miles begins with a single step. Create your first habit quest to start earning XP!</p>
      <PixelButton class="mt-6" onclick={() => showModal = true}>CREATE QUEST</PixelButton>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {#each activeHabits as habit (habit.id)}
        <HabitCard {habit} />
      {/each}
    </div>
  {/if}

</div>

<Modal bind:show={showModal} title="NEW HABIT QUEST">
  <HabitForm onclose={() => showModal = false} />
</Modal>

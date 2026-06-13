<script lang="ts">
  import { achievements } from '../../lib/stores/achievements';
  import AchievementCard from '../../lib/components/achievements/AchievementCard.svelte';
  import PixelCard from '../../lib/components/ui/PixelCard.svelte';
  import ProgressBar from '../../lib/components/ui/ProgressBar.svelte';

  let unlockedCount = $derived($achievements.filter((a: any) => a.unlocked).length);
  let totalCount = $derived($achievements.length);
  
  let currentFilter = $state('ALL');
  const filters = ['ALL', 'STREAK', 'LEVEL', 'COINS', 'TASKS', 'POMODORO', 'SPECIAL'];
  
  let filteredAchievements = $derived(
    currentFilter === 'ALL' 
      ? $achievements 
      : $achievements.filter((a: any) => a.category.toUpperCase() === currentFilter)
  );

  // Helper to sort: Unlocked first, then by rarity
  let sortedAchievements = $derived([...filteredAchievements].sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    return 0; // Maintain natural order for same unlock status
  }));
</script>

<svelte:head>
  <title>Hall of Fame - Arcade Tracker</title>
</svelte:head>

<div class="flex flex-col gap-6">
  <div class="border-b-4 border-border-arcade pb-4">
    <h1 class="font-display text-2xl text-accent-amber neon-text-orange mb-2">🏆 HALL OF FAME</h1>
    <p class="font-body text-text-dim">Your legendary accomplishments.</p>
  </div>

  <PixelCard class="flex flex-col md:flex-row gap-6 items-center">
    <div class="text-center w-full md:w-auto md:min-w-[150px]">
      <div class="text-5xl mb-2">🏅</div>
      <div class="font-display text-sm text-text-primary">COMPLETION</div>
    </div>
    
    <div class="flex-grow w-full">
      <ProgressBar 
        value={unlockedCount} 
        max={totalCount} 
        color="bg-neon-cyan"
        label="UNLOCKED ACHIEVEMENTS"
      />
    </div>
  </PixelCard>

  <div class="flex flex-wrap gap-2 mb-2">
    {#each filters as filter}
      <button 
        class="pixel-border px-3 py-1 text-sm font-display {currentFilter === filter ? 'bg-accent-orange text-white' : 'bg-bg-secondary text-text-dim hover:text-text-primary'}"
        onclick={() => currentFilter = filter}
      >
        {filter}
      </button>
    {/each}
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {#each sortedAchievements as achievement (achievement.id)}
      <AchievementCard {achievement} />
    {/each}
  </div>
</div>

<script lang="ts">
  let { streak = 0, bestStreak = 0 } = $props();
  
  let isHot = $derived(streak >= 3);
  let isEpic = $derived(streak >= 7);
</script>

<div class="flex flex-col items-end">
  <div class="flex items-center gap-1 font-display text-sm {isEpic ? 'text-accent-red animate-pulse' : isHot ? 'text-accent-orange' : 'text-text-dim'}">
    {#if streak > 0}
      <span>{streak}</span>
      <span class="text-lg">{isEpic ? '🔥' : isHot ? '⚡' : '🔥'}</span>
    {:else}
      <span>0</span>
      <span class="text-lg opacity-50 grayscale">🔥</span>
    {/if}
  </div>
  {#if bestStreak > 0}
    <div class="text-[10px] font-body text-text-dim mt-1">BEST: {bestStreak}</div>
  {/if}
</div>

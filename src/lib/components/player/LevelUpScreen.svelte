<script lang="ts">
  import { player } from '../../stores/player';
  import { fade, scale } from 'svelte/transition';
  import { onMount } from 'svelte';
  import PixelButton from '../ui/PixelButton.svelte';

  let prevLevel = 1;
  let show = $state(false);

  $effect(() => {
    if ($player.level > prevLevel && prevLevel !== 1) {
      show = true;
    }
    prevLevel = $player.level;
  });

  function close() {
    show = false;
  }
</script>

{#if show}
  <div 
    class="fixed inset-0 bg-bg-primary/90 z-[1000] flex flex-col items-center justify-center p-4 crt-overlay"
    transition:fade={{ duration: 300 }}
  >
    <div 
      class="text-center flex flex-col items-center gap-8"
      transition:scale={{ duration: 500, start: 0.5, opacity: 0 }}
    >
      <h1 class="font-display text-3xl md:text-5xl text-accent-orange neon-text-orange animate-blink">
        LEVEL UP!
      </h1>
      
      <div class="pixel-border bg-bg-secondary p-8 flex flex-col items-center gap-4">
        <span class="font-body text-text-dim text-xl">YOU ARE NOW</span>
        <div class="text-6xl font-display text-neon-cyan neon-text-cyan">
          LEVEL {$player.level}
        </div>
      </div>
      
      <PixelButton size="lg" onclick={close}>
        CONTINUE QUEST
      </PixelButton>
    </div>
  </div>
{/if}

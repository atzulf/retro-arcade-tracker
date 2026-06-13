<script lang="ts">
  import { player } from '../../stores/player';

  let prevCoins = 0;
  let animating = $state(false);

  // Trigger animation when coins increase
  $effect(() => {
    if ($player.coins > prevCoins) {
      animating = true;
      setTimeout(() => animating = false, 600);
    }
    prevCoins = $player.coins;
  });
</script>

<div class="flex items-center gap-2 bg-bg-tertiary px-3 py-1 border-2 border-border-arcade">
  <div class="w-6 h-6 rounded-full bg-accent-amber border-2 border-[#cc8800] flex items-center justify-center {animating ? 'animate-coin-spin' : ''}">
    <span class="text-[#cc8800] text-xs font-display font-bold">C</span>
  </div>
  <span class="font-display text-accent-amber text-sm neon-text-orange pt-1">
    {$player.coins}
  </span>
</div>

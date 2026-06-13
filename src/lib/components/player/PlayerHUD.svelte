<script lang="ts">
  import { player } from '../../stores/player';
  import ProgressBar from '../ui/ProgressBar.svelte';
  import CoinDisplay from '../ui/CoinDisplay.svelte';
  import Modal from '../ui/Modal.svelte';
  import PixelButton from '../ui/PixelButton.svelte';
  import { xpForNextLevel } from '../../utils/xp';

  let currentLevelXp = $derived($player.xp);
  let nextLevelXp = $derived(xpForNextLevel($player.level));
  let showNameModal = $state(false);
  let playerNameDraft = $state($player.name);

  $effect(() => {
    if (!showNameModal) {
      playerNameDraft = $player.name;
    }
  });

  function openNameEditor() {
    playerNameDraft = $player.name;
    showNameModal = true;
  }

  function savePlayerName() {
    const nextName = playerNameDraft.trim();
    if (!nextName) return;

    player.setName(nextName);
    showNameModal = false;
  }
</script>

<header class="bg-bg-secondary border-b-4 border-border-arcade p-4 sticky top-0 z-40">
  <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    
    <!-- Player Info -->
    <div class="flex items-center gap-4">
      <div class="pixel-border bg-accent-orange text-white p-2 w-12 h-12 flex items-center justify-center font-display text-xl">
        {$player.level}
      </div>
      <div>
        <div class="flex items-center gap-2 flex-wrap">
          <h1 class="font-display text-sm md:text-base text-accent-orange neon-text-orange blink">
            PLAYER: {$player.name}
          </h1>
          <PixelButton size="sm" variant="secondary" onclick={openNameEditor}>
            EDIT NAME
          </PixelButton>
        </div>
        <div class="font-body text-text-dim text-sm mt-1">
          HP: {$player.hp}/{$player.maxHp}
        </div>
      </div>
    </div>

    <!-- Stats Bars -->
    <div class="flex-grow max-w-md w-full flex flex-col gap-2">
      <ProgressBar 
        value={$player.hp} 
        max={$player.maxHp} 
        color="bg-accent-red" 
        label="HP" 
      />
      <ProgressBar 
        value={currentLevelXp} 
        max={nextLevelXp} 
        color="bg-accent-amber" 
        label="XP" 
      />
    </div>

    <!-- Coins -->
    <CoinDisplay />
  </div>
</header>

<Modal bind:show={showNameModal} title="CHANGE PLAYER NAME">
  <form
    class="flex flex-col gap-4"
    onsubmit={(event) => {
      event.preventDefault();
      savePlayerName();
    }}
  >
    <div class="flex flex-col gap-1">
      <label for="player-name" class="text-text-dim text-sm font-body uppercase">Player Name</label>
      <input
        id="player-name"
        bind:value={playerNameDraft}
        class="pixel-border bg-bg-primary text-text-primary p-2 font-body focus:outline-none focus:border-neon-cyan"
        maxlength="24"
        placeholder="Enter new player name"
        required
      />
    </div>

    <div class="flex gap-4">
      <PixelButton type="button" variant="secondary" class="flex-1" onclick={() => showNameModal = false}>
        CANCEL
      </PixelButton>
      <PixelButton type="submit" variant="primary" class="flex-1">
        SAVE NAME
      </PixelButton>
    </div>
  </form>
</Modal>

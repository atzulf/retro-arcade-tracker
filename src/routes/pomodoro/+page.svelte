<script lang="ts">
  import PomodoroTimer from '../../lib/components/pomodoro/PomodoroTimer.svelte';
  import SessionLog from '../../lib/components/pomodoro/SessionLog.svelte';
  import PixelCard from '../../lib/components/ui/PixelCard.svelte';
</script>

<svelte:head>
  <title>Focus Mode - Arcade Tracker</title>
</svelte:head>

<div class="flex flex-col gap-6 h-full">
  <div class="border-b-4 border-border-arcade pb-4">
    <h1 class="font-display text-2xl text-accent-orange neon-text-orange mb-2">FOCUS TERMINAL</h1>
    <p class="font-body text-text-dim">Engage hyper-focus mode to earn massive XP.</p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
    
    <!-- Left: Timer -->
    <div class="lg:col-span-8 flex items-center justify-center">
      <div class="w-full max-w-2xl">
        <PomodoroTimer />
      </div>
    </div>

    <!-- Right: Log -->
    <div class="lg:col-span-4 h-full">
      <PixelCard class="h-[500px] lg:h-full min-h-[400px]">
        <SessionLog />
      </PixelCard>
    </div>

  </div>
</div>

<script lang="ts">
  import { pomodoro } from '../../stores/pomodoro';
  import { getTodayISO } from '../../utils/date';
  
  let todaySessions = $derived($pomodoro.sessions.filter(s => s.date === getTodayISO() && s.completed));
  let totalXP = $derived(todaySessions.reduce((sum, s) => sum + s.xpReward, 0));
  let totalCoin = $derived(todaySessions.reduce((sum, s) => sum + s.coinReward, 0));
  let totalMinutes = $derived(todaySessions.reduce((sum, s) => sum + s.duration, 0));
</script>

<div class="flex flex-col h-full">
  <h3 class="font-display text-sm text-accent-orange neon-text-orange mb-4 border-b-2 border-border-arcade pb-2">
    TODAY'S LOG
  </h3>

  <div class="flex gap-4 mb-4 text-xs font-display">
    <div class="flex-1 pixel-border bg-bg-tertiary p-2 text-center">
      <div class="text-text-dim mb-1">TIME</div>
      <div>{totalMinutes}m</div>
    </div>
    <div class="flex-1 pixel-border bg-bg-tertiary p-2 text-center">
      <div class="text-text-dim mb-1">REWARD</div>
      <div class="text-accent-amber">+{totalCoin}C <span class="text-neon-cyan">+{totalXP}XP</span></div>
    </div>
  </div>

  <div class="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-2">
    {#if todaySessions.length === 0}
      <div class="text-center text-text-dim font-body py-8">
        NO SESSIONS YET TODAY
      </div>
    {:else}
      {#each todaySessions.slice().reverse() as session}
        {@const timeStr = new Date(session.endTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        <div class="flex justify-between items-center p-2 bg-bg-secondary border border-border-arcade font-body text-sm">
          <div class="flex items-center gap-2">
            <span class="text-neon-green">✓</span>
            <span class="text-text-primary">Focus Session</span>
            <span class="text-text-dim text-xs ml-2">{session.duration}m</span>
          </div>
          <div class="text-text-dim">{timeStr}</div>
        </div>
      {/each}
    {/if}
  </div>
</div>

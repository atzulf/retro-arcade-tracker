<script lang="ts">
  import type { Achievement } from '../../types';
  
  let { achievement } = $props<{ achievement: Achievement }>();
  
  const rarityColors: Record<Achievement['rarity'], string> = {
    common: 'border-text-dim shadow-[inset_0_0_10px_rgba(122,139,191,0.2)]',
    rare: 'border-neon-cyan shadow-[inset_0_0_10px_rgba(0,229,255,0.2)]',
    epic: 'border-[#ff00ff] shadow-[inset_0_0_15px_rgba(255,0,255,0.3)]',
    legendary: 'border-accent-amber shadow-[inset_0_0_20px_rgba(255,170,0,0.5)] bg-[rgba(255,170,0,0.05)]'
  };

  const rarityText: Record<Achievement['rarity'], string> = {
    common: 'text-text-dim',
    rare: 'text-neon-cyan',
    epic: 'text-[#ff00ff]',
    legendary: 'text-accent-amber neon-text-orange'
  };
</script>

<div class="relative bg-bg-secondary p-4 flex flex-col h-full 
  {achievement.unlocked ? rarityColors[achievement.rarity] : 'border-2 border-border-arcade opacity-70 grayscale'} 
  border-2 transition-all"
>
  <div class="flex items-start gap-4 mb-2">
    <div class="text-4xl w-12 h-12 flex items-center justify-center bg-bg-primary pixel-border">
      {achievement.unlocked ? achievement.icon : '🔒'}
    </div>
    <div class="flex-grow">
      <h3 class="font-display text-sm {achievement.unlocked ? rarityText[achievement.rarity] : 'text-text-dim'} mb-1">
        {achievement.unlocked ? achievement.name : '??? ??? ???'}
      </h3>
      <div class="text-[10px] uppercase font-display px-1 border inline-block {achievement.unlocked ? rarityColors[achievement.rarity] + ' ' + rarityText[achievement.rarity] : 'border-border-arcade text-text-dim'}">
        {achievement.rarity}
      </div>
    </div>
  </div>
  
  <p class="font-body text-sm text-text-primary mt-2 flex-grow">
    {achievement.unlocked ? achievement.description : 'Unlock condition unknown.'}
  </p>
  
  <div class="mt-3 flex gap-3 text-xs font-display">
    <span class="text-accent-amber">+{achievement.coinReward}C</span>
    <span class="text-neon-cyan">+{achievement.xpReward}XP</span>
  </div>
  
  {#if achievement.unlocked && achievement.unlockedAt}
    <div class="mt-3 text-[10px] font-body text-text-dim text-right">
      UNLOCKED: {new Date(achievement.unlockedAt).toLocaleDateString()}
    </div>
  {/if}
</div>

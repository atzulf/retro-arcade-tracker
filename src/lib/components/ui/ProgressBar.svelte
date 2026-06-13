<script lang="ts">
  let { 
    value = 0, 
    max = 100, 
    color = 'bg-accent-amber',
    label = '',
    showValue = true,
    class: className = ''
  } = $props();

  let percentage = $derived(Math.min(100, Math.max(0, (value / max) * 100)));
</script>

<div class="w-full {className}">
  {#if label || showValue}
    <div class="flex justify-between font-body text-sm mb-1 text-text-dim">
      <span>{label}</span>
      {#if showValue}
        <span>{value}/{max}</span>
      {/if}
    </div>
  {/if}
  <div class="h-4 w-full bg-bg-primary border-2 border-border-arcade p-[2px] relative overflow-hidden">
    <div 
      class="h-full {color} transition-all duration-500 ease-out"
      style="width: {percentage}%"
    >
      <!-- Glossy highlight effect -->
      <div class="w-full h-1/2 bg-white/30"></div>
    </div>
  </div>
</div>

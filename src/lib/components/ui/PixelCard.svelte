<script lang="ts">
  let { 
    class: className = '', 
    title = '',
    children 
  } = $props();
</script>

<div class="arcade-panel p-4 {className}">
  {#if title}
    <div class="mb-4 border-b-2 border-border-arcade pb-2">
      <h3 class="font-display text-sm text-accent-orange neon-text-orange">{title}</h3>
    </div>
  {/if}
  {#if children}
    {@render children()}
  {/if}
</div>

<script lang="ts">
  import { fade } from 'svelte/transition';

  let { 
    show = $bindable(false), 
    title = '',
    children 
  } = $props();

  function close() {
    show = false;
  }
</script>

{#if show}
  <div 
    class="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
    transition:fade={{ duration: 200 }}
    onclick={close}
    onkeydown={(e) => e.key === 'Escape' && close()}
    role="button"
    tabindex="0"
  >
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div 
      class="arcade-panel w-full max-w-md max-h-[90vh] overflow-y-auto"
      onclick={(e) => e.stopPropagation()}
      role="document"
    >
      <div class="sticky top-0 bg-bg-secondary p-4 border-b-2 border-border-arcade flex justify-between items-center z-10">
        <h2 class="font-display text-sm text-accent-orange neon-text-orange">{title}</h2>
        <button 
          onclick={close}
          class="text-text-dim hover:text-accent-red transition-colors font-display text-xl leading-none"
          aria-label="Close modal"
        >
          ×
        </button>
      </div>
      <div class="p-4">
        {#if children}
          {@render children()}
        {/if}
      </div>
    </div>
  </div>
{/if}

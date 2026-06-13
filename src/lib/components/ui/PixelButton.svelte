<script lang="ts">
  let { 
    variant = 'primary', 
    size = 'md', 
    type = 'button',
    class: className = '', 
    disabled = false,
    children, 
    onclick = undefined
  }: {
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
    class?: string;
    disabled?: boolean;
    children?: import('svelte').Snippet;
    onclick?: (e: MouseEvent) => void;
  } = $props();

  const baseClasses = 'pixel-border font-body uppercase transition-all duration-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';
  
  const variants = {
    primary: 'bg-accent-orange text-white hover:bg-accent-amber hover:shadow-[0_0_15px_rgba(255,107,0,0.5)]',
    secondary: 'bg-bg-tertiary text-text-primary hover:bg-border-arcade',
    danger: 'bg-accent-red text-white hover:bg-red-500',
    success: 'bg-neon-green text-bg-primary hover:bg-green-400'
  };

  const sizes = {
    sm: 'text-sm px-2 py-1',
    md: 'text-lg px-4 py-2',
    lg: 'text-xl px-6 py-3 font-display'
  };
</script>

<button 
  {type}
  class="{baseClasses} {variants[variant]} {sizes[size]} {className}"
  {disabled}
  {onclick}
>
  {#if children}
    {@render children()}
  {/if}
</button>

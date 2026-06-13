<script lang="ts">
  import '../app.css';
  import PlayerHUD from '../lib/components/player/PlayerHUD.svelte';
  import Toast from '../lib/components/ui/Toast.svelte';
  import LevelUpScreen from '../lib/components/player/LevelUpScreen.svelte';
  import { page } from '$app/stores';

  let { children } = $props();

  const navItems = [
    { href: '/', icon: '🏠', label: 'DASHBOARD' },
    { href: '/habits', icon: '🎯', label: 'HABITS' },
    { href: '/calendar', icon: '📅', label: 'CALENDAR' },
    { href: '/pomodoro', icon: '🍅', label: 'POMODORO' },
    { href: '/achievements', icon: '🏆', label: 'TROPHIES' }
  ];
</script>

<div class="crt-overlay"></div>

<!-- Mobile Nav -->
<nav class="md:hidden fixed bottom-0 left-0 right-0 bg-bg-secondary border-t-4 border-border-arcade z-50 flex justify-around p-2">
  {#each navItems as item}
    <a 
      href={item.href}
      class="flex flex-col items-center gap-1 p-2 {$page.url.pathname === item.href ? 'text-accent-orange neon-text-orange' : 'text-text-dim hover:text-text-primary'}"
    >
      <span class="text-2xl">{item.icon}</span>
      <span class="text-[10px] font-display hidden sm:block">{item.label}</span>
    </a>
  {/each}
</nav>

<!-- Desktop Sidebar -->
<nav class="hidden md:flex fixed top-0 left-0 bottom-0 w-24 bg-bg-secondary border-r-4 border-border-arcade z-50 flex-col items-center py-6 gap-8">
  <div class="text-3xl animate-pulse">🕹️</div>
  <div class="flex flex-col gap-6 w-full px-2 mt-8">
    {#each navItems as item}
      <a 
        href={item.href}
        class="flex flex-col items-center gap-2 p-3 w-full pixel-border transition-colors {$page.url.pathname === item.href ? 'bg-accent-orange border-white text-white shadow-[0_0_15px_rgba(255,107,0,0.5)]' : 'bg-bg-primary border-border-arcade text-text-dim hover:text-text-primary hover:border-text-primary'}"
        title={item.label}
      >
        <span class="text-2xl">{item.icon}</span>
      </a>
    {/each}
  </div>
</nav>

<div class="min-h-screen pb-20 md:pb-0 md:pl-24 flex flex-col relative z-10">
  <PlayerHUD />
  
  <main class="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
    {@render children()}
  </main>
</div>

<Toast />
<LevelUpScreen />

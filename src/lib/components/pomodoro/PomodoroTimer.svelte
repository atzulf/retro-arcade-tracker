<script lang="ts">
  import { pomodoro } from '../../stores/pomodoro';
  import PixelButton from '../ui/PixelButton.svelte';
  import { getTodayISO } from '../../utils/date';

  let config = $derived($pomodoro.config);
  
  type Mode = 'work' | 'shortBreak' | 'longBreak';
  
  let currentMode = $state<Mode>('work');
  // Initialize with default 25 minutes to avoid reading derived state on initialization;
  // The $effect will immediately sync it to the correct config value if needed.
  let timeLeft = $state(25 * 60);
  let isRunning = $state(false);
  let timerId: number | null = null;
  let sessionStartTime = $state('');
  let lastConfigSignature = '';

  $effect(() => {
    const currentConfigSignature = JSON.stringify(config);
    if (currentConfigSignature !== lastConfigSignature) {
      lastConfigSignature = currentConfigSignature;
      if (!isRunning) {
        if (currentMode === 'work') timeLeft = config.workDuration * 60;
        else if (currentMode === 'shortBreak') timeLeft = config.shortBreak * 60;
        else timeLeft = config.longBreak * 60;
      }
    }
  });

  let minutes = $derived(Math.floor(timeLeft / 60).toString().padStart(2, '0'));
  let seconds = $derived((timeLeft % 60).toString().padStart(2, '0'));
  
  // Calculate how many tomatoes for today
  let todaySessions = $derived($pomodoro.sessions.filter(s => s.date === getTodayISO() && s.completed).length);
  let tomatoes = $derived(todaySessions % config.sessionsBeforeLongBreak);

  function startTimer() {
    if (isRunning) return;
    if (timeLeft === config.workDuration * 60 && currentMode === 'work') {
      sessionStartTime = new Date().toISOString();
    }
    
    isRunning = true;
    timerId = window.setInterval(() => {
      timeLeft--;
      
      if (timeLeft <= 0) {
        completeTimer();
      }
    }, 1000);
  }

  function pauseTimer() {
    isRunning = false;
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function resetTimer() {
    pauseTimer();
    if (currentMode === 'work') timeLeft = config.workDuration * 60;
    else if (currentMode === 'shortBreak') timeLeft = config.shortBreak * 60;
    else timeLeft = config.longBreak * 60;
  }

  function completeTimer() {
    pauseTimer();
    
    if (currentMode === 'work') {
      // Save session
      pomodoro.sessions.add({
        date: getTodayISO(),
        startTime: sessionStartTime,
        endTime: new Date().toISOString(),
        duration: config.workDuration,
        breakDuration: 0,
        completed: true
      });
      
      const newTotal = todaySessions + 1; // It was incremented by store add
      if (newTotal % config.sessionsBeforeLongBreak === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
    } else {
      setMode('work');
    }
  }

  function setMode(mode: Mode) {
    pauseTimer();
    currentMode = mode;
    if (mode === 'work') timeLeft = config.workDuration * 60;
    else if (mode === 'shortBreak') timeLeft = config.shortBreak * 60;
    else timeLeft = config.longBreak * 60;
  }

  const modeColors = {
    work: 'text-accent-orange neon-text-orange',
    shortBreak: 'text-neon-cyan neon-text-cyan',
    longBreak: 'text-neon-green neon-text-green'
  };

  const modeLabels = {
    work: 'FOCUS MODE',
    shortBreak: 'SHORT BREAK',
    longBreak: 'LONG BREAK'
  };
</script>

<div class="flex flex-col items-center">
  <!-- Session Tracker -->
  <div class="flex gap-2 mb-6">
    {#each Array(config.sessionsBeforeLongBreak) as _, i}
      <div class="text-3xl {i < tomatoes ? '' : 'grayscale opacity-30'}">🍅</div>
    {/each}
  </div>

  <!-- Mode Selector -->
  <div class="flex gap-2 mb-8 flex-wrap justify-center">
    <PixelButton 
      variant={currentMode === 'work' ? 'primary' : 'secondary'} 
      size="sm" 
      onclick={() => setMode('work')}
    >
      WORK
    </PixelButton>
    <PixelButton 
      variant={currentMode === 'shortBreak' ? 'primary' : 'secondary'} 
      size="sm" 
      onclick={() => setMode('shortBreak')}
    >
      SHORT BREAK
    </PixelButton>
    <PixelButton 
      variant={currentMode === 'longBreak' ? 'primary' : 'secondary'} 
      size="sm" 
      onclick={() => setMode('longBreak')}
    >
      LONG BREAK
    </PixelButton>
  </div>

  <!-- Timer Display -->
  <div class="pixel-border bg-[#050814] p-8 flex flex-col items-center justify-center min-w-[300px] mb-8 relative overflow-hidden">
    <!-- Scanline specific to timer -->
    <div class="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 pointer-events-none"></div>
    
    <div class="font-display text-sm mb-4 text-text-dim relative z-20">
      {modeLabels[currentMode]}
    </div>
    
    <div class="font-body text-[100px] leading-none {modeColors[currentMode]} relative z-20" style="text-shadow: 0 0 20px currentColor, 0 0 40px currentColor;">
      {minutes}:{seconds}
    </div>
  </div>

  <!-- Controls -->
  <div class="flex gap-4">
    {#if !isRunning}
      <PixelButton size="lg" onclick={startTimer}>START</PixelButton>
    {:else}
      <PixelButton size="lg" variant="danger" onclick={pauseTimer}>PAUSE</PixelButton>
    {/if}
    <PixelButton size="lg" variant="secondary" onclick={resetTimer}>RESET</PixelButton>
  </div>
</div>

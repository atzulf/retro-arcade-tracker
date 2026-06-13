<script lang="ts">
  import { tasks } from '../../stores/tasks';
  import { formatISO, getTodayISO } from '../../utils/date';
  import { getDaysInMonth, startOfMonth, getDay } from 'date-fns';

  let { 
    currentDate = new Date(),
    selectedDate = $bindable(getTodayISO()),
    onselectdate
  } = $props<{
    currentDate: Date,
    selectedDate: string,
    onselectdate?: (date: string) => void
  }>();

  let daysInMonth = $derived(getDaysInMonth(currentDate));
  let firstDayOfMonth = $derived(getDay(startOfMonth(currentDate)));
  let today = getTodayISO();

  // Helper to check if a date has pending or completed tasks
  function getTaskStatus(dateStr: string) {
    const dayTasks = $tasks.filter(t => t.date === dateStr);
    if (dayTasks.length === 0) return 'none';
    const allCompleted = dayTasks.every(t => t.completed);
    return allCompleted ? 'completed' : 'pending';
  }

  const statusClasses = {
    none: 'bg-bg-primary border-border-arcade',
    pending: 'bg-bg-primary border-accent-orange shadow-[inset_0_0_8px_rgba(255,107,0,0.5)]',
    completed: 'bg-[#0f331b] border-neon-green text-neon-green shadow-[inset_0_0_8px_rgba(57,255,20,0.5)]'
  };

  function selectDate(day: number) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    selectedDate = formatISO(d);
    if (onselectdate) onselectdate(selectedDate);
  }
</script>

<div class="grid grid-cols-7 gap-1 font-body">
  <!-- Header -->
  {#each ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as day}
    <div class="text-center text-text-dim text-xs py-2">{day}</div>
  {/each}

  <!-- Empty cells for start of month -->
  {#each Array(firstDayOfMonth) as _}
    <div class="aspect-square bg-transparent"></div>
  {/each}

  <!-- Days -->
  {#each Array(daysInMonth) as _, i}
    {@const dayNum = i + 1}
    {@const dateStr = formatISO(new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum))}
    {@const status = getTaskStatus(dateStr)}
    {@const isSelected = dateStr === selectedDate}
    {@const isToday = dateStr === today}
    
    <button 
      class="aspect-square flex items-center justify-center relative border-2 hover:bg-bg-tertiary transition-colors cursor-pointer text-lg
        {statusClasses[status]} 
        {isSelected ? 'ring-2 ring-neon-cyan z-10' : ''}
      "
      onclick={() => selectDate(dayNum)}
    >
      {dayNum}
      {#if isToday}
        <div class="absolute bottom-1 w-2 h-2 bg-accent-orange"></div>
      {/if}
    </button>
  {/each}
</div>

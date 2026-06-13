<script lang="ts">
  import { tasks } from '../../lib/stores/tasks';
  import { getTodayISO } from '../../lib/utils/date';
  import CalendarGrid from '../../lib/components/tasks/CalendarGrid.svelte';
  import DayTaskList from '../../lib/components/tasks/DayTaskList.svelte';
  import PixelCard from '../../lib/components/ui/PixelCard.svelte';
  import DatePickerField from '../../lib/components/ui/DatePickerField.svelte';
  import PixelButton from '../../lib/components/ui/PixelButton.svelte';
  import Modal from '../../lib/components/ui/Modal.svelte';

  let selectedDate = $state(getTodayISO());
  let currentDate = $state(new Date());

  let showModal = $state(false);
  let newTaskTitle = $state('');
  let newTaskPriority = $state<'easy'|'medium'|'hard'>('medium');
  let newTaskDescription = $state('');
  let newTaskDeadline = $state('');

  function addTask() {
    if (!newTaskTitle.trim()) return;
    
    tasks.add({
      title: newTaskTitle,
      description: newTaskDescription,
      date: selectedDate,
      priority: newTaskPriority,
      deadline: newTaskDeadline || undefined
    });
    
    newTaskTitle = '';
    newTaskDescription = '';
    newTaskPriority = 'medium';
    newTaskDeadline = '';
    showModal = false;
  }

  function prevMonth() {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  }

  function nextMonth() {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  }

  const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
</script>

<svelte:head>
  <title>Quest Calendar - Arcade Tracker</title>
</svelte:head>

<div class="flex flex-col gap-6 h-full min-h-[80vh]">
  <div class="border-b-4 border-border-arcade pb-4">
    <h1 class="font-display text-2xl text-accent-orange neon-text-orange mb-2">QUEST CALENDAR</h1>
    <p class="font-body text-text-dim">Plan your missions. Execute flawlessly.</p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
    
    <!-- Left: Calendar -->
    <div class="flex flex-col gap-4">
      <div class="flex justify-between items-center bg-bg-secondary p-4 pixel-border">
        <button class="text-text-dim hover:text-accent-orange font-display text-xl px-2" onclick={prevMonth}>&lt;</button>
        <h2 class="font-display text-lg text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button class="text-text-dim hover:text-accent-orange font-display text-xl px-2" onclick={nextMonth}>&gt;</button>
      </div>

      <PixelCard class="p-2">
        <CalendarGrid bind:selectedDate {currentDate} />
      </PixelCard>
      
      <div class="flex justify-center gap-4 text-[10px] font-display text-text-dim mt-2">
        <div class="flex items-center gap-1"><div class="w-3 h-3 bg-bg-primary border border-accent-orange shadow-[inset_0_0_4px_rgba(255,107,0,0.5)]"></div> PENDING</div>
        <div class="flex items-center gap-1"><div class="w-3 h-3 bg-[#0f331b] border border-neon-green shadow-[inset_0_0_4px_rgba(57,255,20,0.5)]"></div> CLEARED</div>
      </div>
    </div>

    <!-- Right: Task List -->
    <PixelCard class="h-[500px] lg:h-auto lg:min-h-[600px]">
      <DayTaskList date={selectedDate} onAddQuest={() => {
        newTaskDeadline = selectedDate;
        showModal = true;
      }} />
    </PixelCard>

  </div>
</div>

<Modal bind:show={showModal} title={`NEW QUEST FOR ${selectedDate}`}>
  <form onsubmit={(e) => { e.preventDefault(); addTask(); }} class="flex flex-col gap-4 font-body">
    <div class="flex flex-col gap-1">
      <label for="title" class="text-text-dim text-sm uppercase">Quest Title</label>
      <input 
        id="title" 
        bind:value={newTaskTitle} 
        class="pixel-border bg-bg-primary text-text-primary p-2 focus:outline-none focus:border-neon-cyan"
        placeholder="Defeat the laundry boss"
        required
      />
    </div>

    <div class="flex flex-col gap-1">
      <label for="description" class="text-text-dim text-sm uppercase">Description (Optional)</label>
      <textarea 
        id="description" 
        bind:value={newTaskDescription} 
        class="pixel-border bg-bg-primary text-text-primary p-2 h-20 focus:outline-none focus:border-neon-cyan"
        placeholder="Sort by colors..."
      ></textarea>
    </div>

    <div class="flex flex-col gap-1">
      <label for="priority" class="text-text-dim text-sm uppercase">Priority</label>
      <select id="priority" bind:value={newTaskPriority} class="pixel-border bg-bg-primary text-text-primary p-2 focus:outline-none">
        <option value="easy">EASY (5C, 10XP)</option>
        <option value="medium">MEDIUM (10C, 20XP)</option>
        <option value="hard">HARD (20C, 40XP)</option>
      </select>
    </div>

    <DatePickerField
      id="deadline"
      label="Deadline (Optional)"
      placeholder="Pick a deadline"
      bind:value={newTaskDeadline}
    />

    <div class="mt-4 flex gap-4">
      <PixelButton type="button" variant="secondary" class="flex-1" onclick={() => showModal = false}>CANCEL</PixelButton>
      <PixelButton type="submit" variant="primary" class="flex-1">ADD QUEST</PixelButton>
    </div>
  </form>
</Modal>

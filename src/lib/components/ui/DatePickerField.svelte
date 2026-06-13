<script lang="ts">
  import { onMount } from 'svelte';
  import flatpickr from 'flatpickr';
  import 'flatpickr/dist/flatpickr.css';

  let {
    value = $bindable(''),
    label = 'Date',
    id = 'date-picker',
    placeholder = 'Select a date',
    minDate = undefined,
    class: className = ''
  } = $props<{
    value?: string;
    label?: string;
    id?: string;
    placeholder?: string;
    minDate?: string;
    class?: string;
  }>();

  let inputElement: HTMLInputElement;
  let picker: flatpickr.Instance | undefined;

  onMount(() => {
    picker = flatpickr(inputElement, {
      allowInput: false,
      defaultDate: value || undefined,
      dateFormat: 'Y-m-d',
      altInput: true,
      altFormat: 'F j, Y',
      minDate,
      monthSelectorType: 'dropdown',
      onChange: (_selectedDates, dateStr) => {
        value = dateStr;
      }
    });

    return () => {
      picker?.destroy();
    };
  });

  $effect(() => {
    if (picker && value !== picker.input.value) {
      picker.setDate(value || null, false, 'Y-m-d');
    }
  });
</script>

<div class="flex flex-col gap-1">
  <label for={id} class="text-text-dim text-sm font-body uppercase">{label}</label>
  <input
    bind:this={inputElement}
    {id}
    type="text"
    class="pixel-border bg-bg-primary text-text-primary p-2 font-body focus:outline-none focus:border-neon-cyan {className}"
    {placeholder}
    readonly
  />
</div>
<script lang="ts">
  import { createCalendar } from '$lib'

  export let date: Date | null = null

  const {
    calendarAttrs,
    nextButtonAttrs,
    prevButtonAttrs,
    title,
    days,
    weekdays,
    selected,
  } = createCalendar({
    selected: [date],
  })

  // Update the date when the selected date changes (2-way binding)
  $: date = $selected[0] ? new Date($selected[0]) : null
</script>

<div
  {...$calendarAttrs}
  class="flex max-w-md flex-col overflow-clip rounded-lg border border-neutral-200 bg-white p-4 text-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
>
  <div class="mb-4 flex items-center justify-between">
    <button
      type="button"
      class="mx-4 rounded-md p-2 text-center transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700"
      {...$prevButtonAttrs}
      aria-label="Previous month"
    >
      <svg
        class="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
    <div class="flex-grow text-center font-bold">{$title}</div>
    <button
      type="button"
      class="mx-4 rounded-md p-2 text-center transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700"
      {...$nextButtonAttrs}
      aria-label="Next month"
    >
      <svg
        class="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  </div>
  <div>
    <div
      class="mb-2 grid w-full grid-cols-7 gap-1 text-center text-xs font-bold uppercase"
    >
      {#each $weekdays as weekday, i}
        <div aria-label={weekday}>{weekday.slice(0, 3)}</div>
      {/each}
    </div>
    <div role="grid" class="grid w-full grid-cols-7 gap-1">
      {#each $days as day, i}
        <div
          role="gridcell"
          class="w-full cursor-pointer select-none rounded-md p-2 text-center transition-colors hover:bg-neutral-100 focus:outline-none dark:hover:bg-neutral-700"
          class:is-selected={day.isSelected}
          class:is-today={day.isToday}
          class:is-out-of-month={day.isOutOfMonth}
          {...day.dayAttrs}
        >
          <slot name="day" {...day}>
            {day.date.getDate()}
          </slot>
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="postcss">
  .is-selected {
    @apply bg-accent-500 text-white !important;
  }

  .is-today {
    @apply font-bold underline underline-offset-4;
  }

  .is-out-of-month {
    @apply opacity-20;
  }
</style>

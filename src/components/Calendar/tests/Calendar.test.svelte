<script lang="ts">
  import { createCalendar } from '../calendar'

  export let defaults = {}

  const {
    useCalendar,
    nextButtonProps,
    prevButtonProps,
    title,
    days,
    weekdays,
  } = createCalendar(defaults)
</script>

<div data-testid="calendar" use:useCalendar>
  <div>
    <button type="button" data-testid="prev-month" {...$nextButtonProps}>
      Prev
    </button>
    <div data-testid="title">{$title}</div>
    <button type="button" data-testid="next-month" {...$prevButtonProps}>
      Next
    </button>
  </div>
  <div>
    <div data-testid="weekdays">
      {#each $weekdays as weekday}
        <div data-testid="weekday">{weekday}</div>
      {/each}
    </div>
    <div
      data-testid="days"
      style="display: grid; grid-template-columns: repeat(7, 1fr);"
    >
      {#each $days as day, i}
        <div data-testid="day-{i + 1}" {...day.dayProps}>
          {day.date.getDate()}
        </div>
      {/each}
    </div>
  </div>
</div>

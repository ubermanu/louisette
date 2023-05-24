<script lang="ts">
  import { createCalendar } from '../calendar'

  export let defaults = {}

  const { calendar, nextButtonAttrs, prevButtonAttrs, title, days, weekdays } =
    createCalendar(defaults)
</script>

<div data-testid="calendar" use:calendar>
  <div>
    <button type="button" data-testid="prev-month" {...$prevButtonAttrs}>
      Prev
    </button>
    <div data-testid="title">{$title}</div>
    <button type="button" data-testid="next-month" {...$nextButtonAttrs}>
      Next
    </button>
  </div>
  <div>
    <div data-testid="weekdays">
      {#each $weekdays as weekday, i}
        <div data-testid="weekday-{i + 1}">{weekday.slice(0, 3)}</div>
      {/each}
    </div>
    <div
      data-testid="days"
      style="display: grid; grid-template-columns: repeat(7, 1fr);"
    >
      {#each $days as day, i}
        <div data-testid="day-{i + 1}" {...day.dayAttrs}>
          {day.date.getDate()}
        </div>
      {/each}
    </div>
  </div>
</div>

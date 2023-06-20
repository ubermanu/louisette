<script lang="ts">
  import Calendar from './Calendar.svelte'

  let date: Date | null = null
</script>

<p class="mb-4 text-sm opacity-60">
  You have selected: <strong>{date ? date.toDateString() : 'nothing'}</strong>
</p>

<Calendar bind:date />

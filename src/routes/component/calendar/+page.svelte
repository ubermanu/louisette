<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import CalendarSource from './example/Calendar.svelte?raw'
</script>

<h1>Calendar</h1>

<p>The calendar component allows the user to select a date.</p>

<h2>Example</h2>

<Page />

<h2>Sources</h2>

<p>Page</p>
<code lang="svelte">
  {PageSource.replace('$lib', 'louisette')}
</code>

<p>Calendar</p>
<code lang="svelte">
  {CalendarSource.replace('$lib', 'louisette')}
</code>

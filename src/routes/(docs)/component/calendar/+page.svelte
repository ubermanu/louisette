<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import CalendarSource from './example/Calendar.svelte?raw'
  import Snippet from '../../Snippet.svelte'
</script>

<h1>Calendar</h1>

<p>The <code>calendar</code> component allows the user to select a date.</p>

<h2>Example</h2>

<Page />

<h2>Sources</h2>

<p>Page</p>
<Snippet code={PageSource} />

<p>Calendar</p>
<Snippet code={CalendarSource} />

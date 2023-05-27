<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import ToggleButtonSource from './example/ToggleButton.svelte?raw'
  import Snippet from '../../Snippet.svelte'
</script>

<h1>Toggle Button</h1>

<p>
  A toggle button is a button that has a "pressed" state. It is used to toggle a
  boolean value.
</p>

<h2>Example</h2>

<div>
  <Page />
</div>

<h2>Sources</h2>

<p>Page</p>
<Snippet code={PageSource} />

<p>Toggle Button</p>
<Snippet code={ToggleButtonSource} />

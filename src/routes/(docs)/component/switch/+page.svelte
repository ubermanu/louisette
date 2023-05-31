<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import SwitchSource from './example/Switch.svelte?raw'
  import Snippet from '../../Snippet.svelte'
</script>

<h1>Switch</h1>

<p>
  A switch is a toggle button with two states, with the intent of activating or
  deactivating a feature.
</p>

<p>
  <a
    href="https://www.w3.org/WAI/ARIA/apg/patterns/switch/"
    target="_blank"
    rel="noopener"
  >
    WAI-ARIA: Switch Pattern
  </a>
</p>

<h2>Example</h2>

<Page />

<h2>Sources</h2>

<p>Page</p>
<Snippet code={PageSource} />

<p>Switch</p>
<Snippet code={SwitchSource} />

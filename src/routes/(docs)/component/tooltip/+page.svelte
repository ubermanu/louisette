<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import HelpSource from './example/Help.svelte?raw'
  import Snippet from '../../Snippet.svelte'
</script>

<h1>Tooltip</h1>

<p>
  A <code>tooltip</code> is a small pop-up that appears when a user places their
  cursor over an element such as a button or link.
</p>

<p>
  <a
    href="https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/"
    target="_blank"
    rel="noopener"
  >
    WAI-ARIA: Tooltip Pattern
  </a>
</p>

<h2>Example</h2>

<div>
  <Page />
</div>

<h2>Sources</h2>

<p>Page</p>
<Snippet code={PageSource} />

<p>Help</p>
<Snippet code={HelpSource} />

<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import ToolbarSource from './example/Toolbar.svelte?raw'
  import ButtonSource from './example/Button.svelte?raw'
  import Snippet from '../../Snippet.svelte'
</script>

<h1>Toolbar</h1>

<p>
  A toolbar is a container for buttons and other controls. <br />
  Keyboard navigation is handled in a way that only one button can be focused at
  a time.
</p>

<p>
  <a
    href="https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/"
    target="_blank"
    rel="noopener"
  >
    WAI-ARIA: Toolbar Pattern
  </a>
</p>

<h2>Example</h2>

<div>
  <Page />
</div>

<h2>Sources</h2>

<p>Page</p>
<Snippet code={PageSource} />

<p>Toolbar</p>
<Snippet code={ToolbarSource} />

<p>Button</p>
<Snippet code={ButtonSource} />

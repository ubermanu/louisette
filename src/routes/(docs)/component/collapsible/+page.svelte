<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import CollapsibleSource from './example/Collapsible.svelte?raw'
  import Snippet from '../../Snippet.svelte'
</script>

<h1>Collapsible</h1>

<p>
  The collapsible component allows the user to hide and show a section of the
  page.
</p>

<p>
  <a
    href="https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/"
    target="_blank"
    rel="noopener"
  >
    WAIA-ARIA: Disclosure Pattern
  </a>
</p>

<h2>Example</h2>

<Page />

<h2>Sources</h2>

<p>Page</p>
<Snippet code={PageSource} />

<p>Collapsible</p>
<Snippet code={CollapsibleSource} />

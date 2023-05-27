<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import MenuSource from './example/Menu.svelte?raw'
</script>

<h1>Menu</h1>

<p>
  <a
    href="https://www.w3.org/WAI/ARIA/apg/patterns/menu/"
    target="_blank"
    rel="noopener"
  >
    WAI-ARIA: Menu Pattern
  </a>
</p>

<h2>Example</h2>

<div>
  <Page />
</div>

<h2>Sources</h2>

<p>Page</p>
<code lang="svelte">
  {PageSource.replace('$lib', 'louisette')}
</code>

<p>Menu</p>
<code lang="svelte">
  {MenuSource.replace('$lib', 'louisette')}
</code>

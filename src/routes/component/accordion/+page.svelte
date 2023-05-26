<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import AccordionSource from './example/Accordion.svelte?raw'
  import AccordionItemSource from './example/AccordionItem.svelte?raw'
</script>

<h1>Accordion</h1>

<p>
  The accordion component provides a way to display a list of items that can be
  expanded or collapsed.
</p>

<p>
  <a
    href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/"
    target="_blank"
    rel="noopener"
  >
    WAI-ARIA: Accordion Pattern
  </a>
</p>

<h2>Example</h2>

<Page />

<h2>Sources</h2>

<p>Page</p>
<code lang="svelte">
  {PageSource.replace('$lib', 'louisette')}
</code>

<p>Accordion</p>
<code lang="svelte">
  {AccordionSource.replace('$lib', 'louisette')}
</code>

<p>Accordion Item</p>
<code lang="svelte">
  {AccordionItemSource.replace('$lib', 'louisette')}
</code>

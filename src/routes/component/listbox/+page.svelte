<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import ListboxSource from './example/Listbox.svelte?raw'
  import ListboxItemSource from './example/ListboxItem.svelte?raw'
</script>

<h1>Listbox</h1>

<p>
  A listbox is a widget that allows the user to select one or more items from a
  list of choices.
</p>

<p>
  <a
    href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/"
    target="_blank"
    rel="noopener"
  >
    WAI-ARIA: Listbox Pattern
  </a>
</p>

<h2>Example</h2>

<Page />

<h2>Sources</h2>

<p>Page</p>
<code lang="svelte">
  {PageSource.replace('$lib', 'louisette')}
</code>

<p>Listbox</p>
<code lang="svelte">
  {ListboxSource.replace('$lib', 'louisette')}
</code>

<p>ListboxItem</p>
<code lang="svelte">
  {ListboxItemSource.replace('$lib', 'louisette')}
</code>

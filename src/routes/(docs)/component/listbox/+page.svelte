<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import ListboxSource from './example/Listbox.svelte?raw'
  import ListboxItemSource from './example/ListboxItem.svelte?raw'
  import Snippet from '../../Snippet.svelte'
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
<Snippet code={PageSource} />

<p>Listbox</p>
<Snippet code={ListboxSource} />

<p>ListboxItem</p>
<Snippet code={ListboxItemSource} />

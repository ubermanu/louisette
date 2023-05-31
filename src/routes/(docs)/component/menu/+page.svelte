<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import MenuSource from './example/Menu.svelte?raw'
  import MenuItemSource from './example/MenuItem.svelte?raw'
  import MenuDividerSource from './example/MenuDivider.svelte?raw'
  import Snippet from '../../Snippet.svelte'
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
<Snippet code={PageSource} />

<p>Menu</p>
<Snippet code={MenuSource} />

<p>MenuItem</p>
<Snippet code={MenuItemSource} />

<p>MenuDivider</p>
<Snippet code={MenuDividerSource} />

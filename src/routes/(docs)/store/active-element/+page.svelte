<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import Snippet from '../../Snippet.svelte'
</script>

<h1>Active element</h1>

<p>
  The <code>activeElement</code> store keeps track of the currently focused element
  in the document.
</p>

<h2>Example</h2>

<div>
  <Page />
</div>

<h2>Source</h2>

<Snippet code={PageSource} />

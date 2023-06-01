<script lang="ts">
  import Page from './example/+page.svelte'
  import ColorAreaSource from './example/ColorArea.svelte?raw'
  import Snippet from '../../Snippet.svelte'
</script>

<h1>Move</h1>

<p>Attach controls to an element that allow it to be moved around the page.</p>

<h2>Example</h2>

<div>
  <Page />
</div>

<h2>Sources</h2>

<p>Color Area</p>
<Snippet code={ColorAreaSource} />

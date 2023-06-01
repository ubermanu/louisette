<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import ButtonSource from './example/Button.svelte?raw'
  import Snippet from '../../Snippet.svelte'
</script>

<h1>Press</h1>

<p>
  The press interaction is used to indicate that an element is being pushed
  down.
</p>

<h2>Example</h2>

<div>
  <Page />
</div>

<h2>Sources</h2>

<p>Page</p>
<Snippet code={PageSource} />

<p>Button</p>
<Snippet code={ButtonSource} />

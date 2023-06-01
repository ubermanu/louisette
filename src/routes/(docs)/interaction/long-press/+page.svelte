<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import ConfettiButtonSource from './example/ConfettiButton.svelte?raw'
  import Snippet from '../../Snippet.svelte'
</script>

<h1>Long Press</h1>

<p>
  The long press interaction is a common pattern on mobile devices. It is
  typically used to trigger a context menu or to select an item.
</p>

<h2>Example</h2>

<div>
  <Page />
</div>

<h2>Sources</h2>

<p>Page</p>
<Snippet code={PageSource} />

<p>Confetti Button</p>
<Snippet code={ConfettiButtonSource} />

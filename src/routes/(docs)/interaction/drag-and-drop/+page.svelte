<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import ProductSource from './example/Product.svelte?raw'
  import BasketSource from './example/Basket.svelte?raw'
  import Snippet from '../../Snippet.svelte'
</script>

<h1>Drag and Drop</h1>

<p>The Drag and Drop interactions allows data transfer between components.</p>

<h2>Example</h2>

<div>
  <Page />
</div>

<h2>Sources</h2>

<p>Page</p>
<Snippet code={PageSource} />

<p>Product</p>
<Snippet code={ProductSource} />

<p>Basket</p>
<Snippet code={BasketSource} />

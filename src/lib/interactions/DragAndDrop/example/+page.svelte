<script lang="ts">
  import Basket from './Basket.svelte'
  import Product from './Product.svelte'

  const products = ['🧀', '🧴', '🪥', '🥑', '🥖', '☕', '🍺', '🍅', '🐟']
</script>

<div class="mb-4 flex w-fit flex-wrap gap-2 rounded">
  {#each products as value}
    <Product {value} />
  {/each}
</div>

<p class="mb-2 text-xs opacity-50">Drag a product into your basket</p>
<Basket items={['🥑', '🐟']} />

<script lang="ts">
  import { createKey, type Toolbar } from '$lib'
  import { getContext } from 'svelte'

  // Generate a unique key for this item
  const key = createKey()

  const { itemAttrs } = getContext<Toolbar>('toolbar')
</script>

<button
  {...$itemAttrs(key)}
  class="rounded p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800"
  on:click
  {...$$restProps}
>
  <slot />
</button>

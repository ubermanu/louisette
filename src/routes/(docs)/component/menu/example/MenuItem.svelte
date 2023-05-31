<script lang="ts">
  import type { Menu } from '$lib'
  import { getContext } from 'svelte'

  // Generate a random key for this menu item
  const key = Math.random().toString(36).substring(7)

  const { itemAttrs } = getContext<Menu>('menu')
</script>

<div {...$itemAttrs(key)}>
  <slot />
</div>

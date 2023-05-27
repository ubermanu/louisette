<script lang="ts">
  import type { Menu } from '$lib'
  import { getContext } from 'svelte'

  const { separatorAttrs } = getContext<Menu>('menu')
</script>

<div {...$separatorAttrs} />

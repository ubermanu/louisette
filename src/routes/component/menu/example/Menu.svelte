<script lang="ts">
  import { createMenu } from '$lib'
  import { setContext } from 'svelte'

  const { menu, menuAttrs, ...menuContext } = createMenu()
  setContext('menu', menuContext)
</script>

<div use:menu {...$menuAttrs}>
  <slot />
</div>

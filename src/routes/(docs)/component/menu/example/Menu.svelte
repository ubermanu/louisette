<script lang="ts">
  import { createMenu } from '$lib'
  import { setContext } from 'svelte'

  const { menu, menuAttrs, ...menuContext } = createMenu()
  setContext('menu', menuContext)
</script>

<ul
  use:menu
  {...$menuAttrs}
  class="flex w-max min-w-[12rem] flex-col gap-1 rounded bg-white p-2 shadow dark:bg-neutral-900"
>
  <slot />
</ul>

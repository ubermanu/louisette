<script lang="ts">
  import { createMenu } from '$lib'
  import { setContext } from 'svelte'

  const { menuAttrs, ...menuContext } = createMenu()

  setContext('menu', menuContext)
</script>

<ul
  {...$menuAttrs}
  class="flex w-max min-w-[12rem] flex-col gap-1 rounded bg-white p-2 shadow-lg dark:bg-neutral-900"
>
  <slot />
</ul>

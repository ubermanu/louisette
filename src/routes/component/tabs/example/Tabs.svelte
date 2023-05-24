<script lang="ts">
  import { createTabs } from '$lib'
  import { setContext } from 'svelte'

  const { tabs, listAttrs, ...tabsContext } = createTabs()
  setContext('tabs', tabsContext)
</script>

<div
  use:tabs
  class="flex max-w-md flex-col gap-2 overflow-clip rounded-lg border border-t-0 border-neutral-200 bg-white p-4 text-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
>
  <div {...$listAttrs} class="flex gap-2">
    <slot name="tabs" />
  </div>
  <slot />
</div>

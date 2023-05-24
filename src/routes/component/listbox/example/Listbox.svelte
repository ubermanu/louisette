<script lang="ts">
  import { createListbox } from '$lib'
  import { setContext } from 'svelte'

  const { listbox, listboxAttrs, ...listboxContext } = createListbox()
  setContext('listbox', listboxContext)
</script>

<div
  use:listbox
  class="flex max-w-md flex-col gap-2 overflow-clip rounded-lg border border-t-0 border-neutral-200 bg-white p-4 text-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
  {...$listboxAttrs}
>
  <slot />
</div>

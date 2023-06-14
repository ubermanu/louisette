<script lang="ts">
  import { createListbox } from '$lib'
  import { setContext } from 'svelte'

  export let label: string
  export let multiple: boolean = false
  export let value: string | string[] = ''

  const listboxContext = createListbox({ multiple })
  setContext('listbox', listboxContext)

  const { listbox, listboxAttrs, selected: selectedList } = listboxContext

  $: value = multiple ? $selectedList : $selectedList[0]
</script>

<div
  use:listbox
  class="flex max-w-md flex-col gap-2 overflow-clip rounded-lg border border-neutral-200 bg-white p-4 text-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
  {...$listboxAttrs}
  aria-label={label}
>
  <slot />
</div>

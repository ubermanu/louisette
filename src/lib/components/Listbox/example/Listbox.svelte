<script lang="ts">
  import { createListbox } from '$lib'
  import { setContext } from 'svelte'

  export let label: string
  export let multiple: boolean = false
  export let value: string | string[] = ''

  const listboxContext = createListbox({ multiple })
  setContext('listbox', listboxContext)

  const { listboxAttrs, selected: selectedList } = listboxContext

  // 2-way binding to expose the selected value(s) to the parent component
  $: value = multiple ? $selectedList : $selectedList[0] ?? ''
</script>

<div
  class="flex max-w-sm flex-col gap-2 overflow-clip rounded-lg border border-neutral-200 bg-white p-4 text-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
  {...$listboxAttrs}
  aria-label={label}
>
  <slot />
</div>

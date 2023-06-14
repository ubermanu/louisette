<script lang="ts">
  import type { Select } from '$lib'
  import { getContext } from 'svelte'

  export let value: string
  export let selected: boolean = false

  const { optionAttrs, select } = getContext<Select>('select')

  if (selected) select(value)
</script>

<div
  {...$optionAttrs(value)}
  class="cursor-pointer rounded-md p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
>
  <slot />
</div>

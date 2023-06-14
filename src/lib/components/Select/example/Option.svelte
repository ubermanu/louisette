<script lang="ts">
  import type { Select } from '$lib'
  import { getContext } from 'svelte'

  export let value: string
  export let selected: boolean = false
  export let disabled: boolean = false

  const {
    optionAttrs,
    select,
    selected: selectedList,
  } = getContext<Select>('select')

  if (selected) select(value)
</script>

<div
  {...$optionAttrs(value)}
  class="flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
>
  <span>
    <slot />
  </span>
  {#if $selectedList.includes(value)}
    <svg
      class="text-primary-500 dark:text-primary-400 ml-2 h-4 w-4"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        clip-rule="evenodd"
        d="M10.707 14.707a1 1 0 01-1.414 0L5 10.414A1 1 0 016.414 9l3.293 3.293 6.293-6.293a1 1 0 111.414 1.414l-7 7z"
        fill-rule="evenodd"
      />
    </svg>
  {/if}
</div>

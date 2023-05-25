<script lang="ts">
  import type { RadioGroup } from '$lib'
  import { getContext } from 'svelte'

  export let value: string

  const { radioAttrs, selected } = getContext<RadioGroup>('radioGroup')
</script>

<div
  {...$radioAttrs(value)}
  class="cursor-pointer rounded-md bg-white p-4 text-neutral-900 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:bg-neutral-100 focus-visible:ring focus-visible:ring-accent-500 focus-visible:ring-opacity-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 dark:focus-visible:bg-neutral-700"
  class:is-selected={$selected === value}
>
  <slot />
</div>

<style lang="postcss">
  .is-selected {
    @apply bg-accent-500 text-white !important;
  }
</style>

<script lang="ts">
  import { getContext } from 'svelte'

  export let value: string

  const { radioAttrs, selected } = getContext('radioGroup')
</script>

<div
  {...$radioAttrs(value)}
  class="cursor-pointer rounded-md bg-white p-2 p-4 text-neutral-900 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
  class:is-selected={$selected === value}
>
  <slot />
</div>

<style lang="postcss">
  .is-selected {
    @apply bg-blue-500 text-white dark:bg-blue-500 dark:text-white;
  }
</style>

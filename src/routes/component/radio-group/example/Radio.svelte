<script lang="ts">
  import type { RadioGroup } from '$lib'
  import { getContext } from 'svelte'
  import { CheckCircle, Circle } from 'lucide-svelte'

  export let value: string

  const { radioAttrs, selected } = getContext<RadioGroup>('radioGroup')
</script>

<div
  {...$radioAttrs(value)}
  class="flex cursor-pointer items-center rounded-md p-4 text-neutral-900 transition-colors hover:bg-neutral-200 focus:outline-none focus-visible:bg-neutral-200 focus-visible:ring focus-visible:ring-accent-500 focus-visible:ring-opacity-50 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700 dark:focus-visible:bg-neutral-700"
  class:is-selected={$selected === value}
>
  <svelte:component
    this={$selected === value ? CheckCircle : Circle}
    class="mr-4 h-4 w-4 flex-shrink-0"
  />
  <span>
    <slot />
  </span>
</div>

<style lang="postcss">
  .is-selected {
    @apply bg-accent-200 dark:bg-accent-500 dark:text-neutral-100 !important;
  }
</style>

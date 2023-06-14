<script lang="ts">
  import type { Listbox } from '$lib'
  import { getContext } from 'svelte'

  export let value: string

  const { optionAttrs, selected, activeDescendant } =
    getContext<Listbox>('listbox')
</script>

<div
  class="cursor-pointer rounded-md p-2 transition-colors hover:bg-neutral-200 focus:outline-none focus-visible:ring focus-visible:ring-accent-500 focus-visible:ring-opacity-50 dark:hover:bg-neutral-700"
  class:is-selected={$selected.includes(value)}
  class:is-active-descendant={$activeDescendant === value}
  {...$optionAttrs(value)}
>
  <slot />
</div>

<style lang="postcss">
  .is-selected {
    @apply bg-accent-200 dark:bg-accent-700;
  }

  .is-active-descendant {
    @apply ring ring-accent-500 ring-opacity-50;
  }
</style>

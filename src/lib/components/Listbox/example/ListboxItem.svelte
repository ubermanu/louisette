<script lang="ts">
  import type { Listbox } from '$lib'
  import { getContext } from 'svelte'

  export let value: string

  const {
    optionAttrs,
    selected: selectedList,
    activeDescendant,
  } = getContext<Listbox>('listbox')
</script>

<div
  class="flex cursor-pointer items-center justify-between gap-4 rounded-md p-2 transition-colors hover:bg-neutral-200 focus:outline-none focus-visible:ring focus-visible:ring-accent-500 focus-visible:ring-opacity-50 dark:hover:bg-neutral-700 text-sm"
  class:is-active-descendant={$activeDescendant === value}
  {...$optionAttrs(value)}
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

<style lang="postcss">
  .is-active-descendant {
    @apply bg-neutral-200 dark:bg-neutral-700;
  }
</style>

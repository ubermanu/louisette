<script lang="ts">
  import type { Accordion } from '$lib'
  import { getContext } from 'svelte'

  export let heading: string

  // Generate a random key for this accordion item
  const key = Math.random().toString(36).substring(7)

  const { triggerAttrs, contentAttrs, expanded } =
    getContext<Accordion>('accordion')
</script>

<div
  class="overflow-clip border border-t-0 border-neutral-200 bg-white text-neutral-900 first:rounded-t-lg last:rounded-b-lg dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
>
  <div
    {...$triggerAttrs(key)}
    class="flex cursor-pointer select-none items-center px-5 py-4 font-semibold leading-5 transition-colors duration-200 ease-in-out hover:bg-neutral-100 focus:outline-none focus-visible:bg-neutral-100 dark:hover:bg-neutral-700 dark:focus-visible:bg-neutral-700"
  >
    {heading}
    <span class="ml-auto" class:rotate-180={$expanded.includes(key)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="h-4 w-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    </span>
  </div>
  <div
    {...$contentAttrs(key)}
    class="px-5 py-4 text-sm leading-5 transition-colors duration-200 ease-in-out"
    class:hidden={!$expanded.includes(key)}
  >
    <slot />
  </div>
</div>

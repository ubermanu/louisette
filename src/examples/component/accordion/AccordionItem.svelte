<script lang="ts">
  import { createKey, type Accordion } from '$lib'
  import { getContext } from 'svelte'

  export let heading: string
  export let disabled: boolean = false
  export let open: boolean = false

  // Generate a random key for this accordion item
  const key = createKey()

  const { triggerAttrs, contentAttrs, expanded, expand, disable } =
    getContext<Accordion>('accordion')

  if (open) {
    expand(key)
  }

  if (disabled) {
    disable(key)
  }
</script>

<div
  class="border border-neutral-200 bg-white text-neutral-900 shadow-sm first:rounded-t-lg last:rounded-b-lg dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 [&:not(:first-child)]:border-t-0"
>
  <div
    {...$triggerAttrs(key)}
    class="flex cursor-pointer select-none items-center rounded-sm px-5 py-4 font-semibold leading-5 transition-colors duration-200 ease-in-out hover:bg-neutral-100 focus-visible:bg-neutral-100 dark:hover:bg-neutral-700 dark:focus-visible:bg-neutral-700"
    class:is-disabled={disabled}
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

<style lang="postcss">
  .is-disabled {
    @apply pointer-events-none opacity-50;
  }
</style>

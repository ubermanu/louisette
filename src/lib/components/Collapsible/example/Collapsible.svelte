<script lang="ts">
  import { createCollapsible } from '$lib'

  export let icon: string = ''
  export let heading: string

  const { triggerAttrs, contentAttrs, expanded } = createCollapsible()
</script>

<div
  class="max-w-xl rounded-lg border border-neutral-200 bg-white text-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
>
  <div
    class="space-between flex items-center rounded-lg p-4 font-semibold transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:bg-neutral-100 focus-visible:ring focus-visible:ring-accent-500 focus-visible:ring-opacity-50 dark:hover:bg-neutral-700 dark:focus-visible:bg-neutral-700"
    {...$triggerAttrs}
  >
    {#if icon}
      <span class="mr-2" aria-hidden="true">{icon}</span>
    {/if}
    {heading}
    <span class="ml-auto" class:rotate-180={$expanded}>
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
  <div class="p-4 text-sm" class:hidden={!$expanded} {...$contentAttrs}>
    <slot />
  </div>
</div>

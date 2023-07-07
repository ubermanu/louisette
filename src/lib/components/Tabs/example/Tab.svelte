<script lang="ts">
  import type { Tabs } from '$lib'
  import { getContext } from 'svelte'

  export let key: string
  export let icon: string = ''

  const { tabAttrs, active } = getContext<Tabs>('tabs')
</script>

<div
  {...$tabAttrs(key)}
  class="flex cursor-pointer select-none flex-wrap items-center gap-1 rounded-md p-2 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-accent-500 focus-visible:ring-opacity-50 dark:hover:bg-neutral-700 max-md:justify-center"
  class:is-active={$active === key}
>
  {#if icon}
    <span class="mr-1 text-sm" aria-hidden="true">{icon}</span>
  {/if}
  <slot />
</div>

<style lang="postcss">
  .is-active {
    @apply bg-neutral-300 dark:bg-neutral-700;
  }
</style>

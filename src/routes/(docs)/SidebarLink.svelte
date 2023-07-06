<script lang="ts">
  import type { Menu } from '$lib'
  import { page } from '$app/stores'
  import { getContext } from 'svelte'

  export let href: string

  const { itemAttrs } = getContext<Menu>('menu')
</script>

<a
  {...$itemAttrs(href)}
  {href}
  aria-current={$page.url.pathname === href ? 'page' : undefined}
  class="block w-full rounded-lg px-4 py-2 text-sm transition-colors duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 md:px-2 md:py-1"
  class:is-active={$page.url.pathname === href}
>
  <slot />
</a>

<style lang="postcss">
  .is-active {
    @apply bg-accent-400 text-white dark:bg-accent-500 dark:text-white;
  }
</style>

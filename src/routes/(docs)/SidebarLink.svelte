<script lang="ts">
  import { page } from '$app/stores'

  export let href: string
</script>

<a
  {href}
  aria-current={$page.url.pathname === href ? 'page' : undefined}
  class="block w-full rounded-lg px-4 py-2 text-sm transition-colors duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-800"
  class:is-active={$page.url.pathname === href}
>
  <slot />
</a>

<style lang="postcss">
  .is-active {
    @apply bg-accent-400 text-white dark:bg-accent-500 dark:text-white;
  }
</style>

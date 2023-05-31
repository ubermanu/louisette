<script lang="ts">
  import type { Menu } from '$lib'
  import { getContext } from 'svelte'

  // Define the item as a link
  export let href: string | null = null

  // Generate a random key for this menu item
  const key = Math.random().toString(36).substring(7)

  const { itemAttrs } = getContext<Menu>('menu')
</script>

<li>
  {#if href}
    <a {...$itemAttrs(key)} {href} class="item">
      <slot />
    </a>
  {:else}
    <button {...$itemAttrs(key)} on:click class="item">
      <slot />
    </button>
  {/if}
</li>

<style lang="postcss">
  .item {
    @apply block rounded-sm px-4 py-1 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700;
  }
</style>

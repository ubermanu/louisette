<script lang="ts">
  import { createKey, type Menu } from '$lib'
  import { getContext, setContext } from 'svelte'
  import { ChevronRight } from 'lucide-svelte'

  export let href: string = ''

  // Generate a random key for this menu item
  const key = createKey()

  // Check if this menu item has a submenu
  const hasSubmenu = $$slots.submenu !== undefined

  // Get the menu item attributes
  const { itemAttrs, triggerAttrs } = getContext<Menu>('menu')

  // Set the key of the submenu if this menu item has one
  setContext('submenu', hasSubmenu ? key : null)
</script>

<li class="relative">
  {#if hasSubmenu}
    <span
      {...$triggerAttrs(key)}
      class="flex items-center justify-between rounded-sm px-4 py-1 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
    >
      <slot />
      <ChevronRight class="ml-2 h-4 w-4" />
    </span>
    <slot name="submenu" />
  {:else}
    <a
      {...$itemAttrs(key)}
      {href}
      class="flex items-center rounded-sm px-4 py-1 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
    >
      <slot />
    </a>
  {/if}
</li>

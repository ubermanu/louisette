<script lang="ts">
  import { useHover, useFocusVisible, type Menu } from '$lib'
  import { getContext } from 'svelte'
  import { ChevronRight } from 'lucide-svelte'

  export let href: string

  // Generate a random key for this menu item
  const key = Math.random().toString(36).substring(7)

  const { itemAttrs } = getContext<Menu>('menu')

  const hasSubmenu = $$slots.submenu !== undefined

  const { hover, hovering } = useHover()
  const { focusVisible, focused } = useFocusVisible()

  // TODO: Add proper menu navigation
  // TODO: Use popover primitive
</script>

<li class:relative={hasSubmenu} use:hover use:focusVisible>
  <a
    {...$itemAttrs(key)}
    {href}
    class="flex items-center justify-between gap-2 rounded-sm px-4 py-1 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
    aria-haspopup={hasSubmenu ? 'true' : undefined}
  >
    <span><slot /></span>
    {#if hasSubmenu}
      <ChevronRight class="h-4 w-4" />
    {/if}
  </a>
  {#if hasSubmenu && ($hovering || $focused)}
    <div class="absolute left-full top-0 z-10 -mt-2 pl-2 shadow-lg">
      <slot name="submenu" />
    </div>
  {/if}
</li>

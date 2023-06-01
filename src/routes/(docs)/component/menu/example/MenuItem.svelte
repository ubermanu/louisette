<script lang="ts">
  import { createPopover, useHover, type Menu } from '$lib'
  import { getContext, tick } from 'svelte'
  import { ChevronRight } from 'lucide-svelte'

  export let href: string

  // Generate a random key for this menu item
  const key = Math.random().toString(36).substring(7)

  // Check if this menu item has a submenu
  const hasSubmenu = $$slots.submenu !== undefined

  // Get the menu item attributes
  const { itemAttrs, orientation } = getContext<Menu>('menu')

  // Create a popover for the submenu
  const { triggerAttrs, visible, show, hide } = createPopover()

  // Reveals the submenu when the menu item is hovered
  const { hover } = useHover({
    onHoverStart: () => show(),
    onHoverEnd: () => hide(),
  })

  let menuitem: HTMLElement
  let submenuContainer: HTMLElement

  // TODO: Improve keyboard navigation (WIP)
  const onKeyDown = (event: KeyboardEvent) => {
    if (!hasSubmenu) {
      return
    }

    if (
      (event.key === 'ArrowRight' && $orientation === 'vertical') ||
      (event.key === 'ArrowDown' && $orientation === 'horizontal')
    ) {
      event.preventDefault()
      show()

      // Focus the first menu item in the submenu
      // TODO: Find a way to get the submenu instance?
      tick().then(() => {
        ;(
          submenuContainer.querySelector('[data-menu-item]') as HTMLElement
        )?.focus()
      })
    }

    if (
      event.key === 'Escape' ||
      (event.key === 'ArrowLeft' && $orientation === 'vertical') ||
      (event.key === 'ArrowUp' && $orientation === 'horizontal')
    ) {
      event.preventDefault()
      hide()
      menuitem?.focus()
    }
  }
</script>

<li class="relative" use:hover>
  <a
    bind:this={menuitem}
    {...$itemAttrs(key)}
    {...$triggerAttrs}
    {href}
    class="flex items-center justify-between gap-2 rounded-sm px-4 py-1 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
    on:keydown={onKeyDown}
  >
    <span><slot /></span>
    {#if hasSubmenu}
      <ChevronRight class="h-4 w-4" />
    {/if}
  </a>
  {#if hasSubmenu && $visible}
    <div
      bind:this={submenuContainer}
      class="absolute left-full top-0 z-10 -mt-2 pl-2 shadow-lg"
    >
      <slot name="submenu" />
    </div>
  {/if}
</li>

<script lang="ts">
  import { createPopover, useHover, type Menu } from '$lib'
  import { getContext, setContext, tick } from 'svelte'
  import { ChevronRight } from 'lucide-svelte'

  export let href: string

  // Generate a random key for this menu item
  const key = Math.random().toString(36).substring(7)

  // Check if this menu item has a submenu
  const hasSubmenu = $$slots.submenu !== undefined

  // Get the menu item attributes
  const { itemAttrs, orientation } = getContext<Menu>('menu')

  type Submenu = {
    key: string
    show: () => void
    hide: () => void
  }

  // Get the parent menu context
  const parent = getContext<Submenu>('submenu')

  // Create a popover for the submenu
  const { triggerAttrs, visible, show, hide } = createPopover()

  // Reveals the submenu when the menu item is hovered
  const { hover } = useHover({
    onHoverStart: () => show(),
    onHoverEnd: () => hide(),
  })

  let submenuContainer: HTMLElement

  // Set the submenu context with parent controls
  setContext('submenu', { key, show, hide })

  // Improve keyboard navigation
  const onKeyDown = async (event: KeyboardEvent) => {
    if (
      parent &&
      (event.key === 'Escape' ||
        (event.key === 'ArrowLeft' && $orientation === 'vertical') ||
        (event.key === 'ArrowUp' && $orientation === 'horizontal'))
    ) {
      event.preventDefault()
      parent?.hide()
      await tick()

      // TODO: Maybe use a store that references the menu item element, so we can focus it here
      ;(
        document.querySelector(
          `[data-menu-item="${parent.key}"]`
        ) as HTMLElement
      )?.focus()
    }

    if (
      hasSubmenu &&
      ((event.key === 'ArrowRight' && $orientation === 'vertical') ||
        (event.key === 'ArrowDown' && $orientation === 'horizontal'))
    ) {
      event.preventDefault()
      show()
      await tick()
      // Focus the first menu item in the submenu
      // TODO: Trigger a focus event on the submenu, so it can be redirected to the first focusable element
      ;(
        submenuContainer.querySelector('[data-menu-item]') as HTMLElement
      )?.focus()
    }
  }
</script>

<li class="relative" use:hover>
  <a
    {...$itemAttrs(key)}
    {...hasSubmenu ? $triggerAttrs : null}
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

import { onBrowserMount } from '$lib/helpers/environment.js'
import type { DelegateEvent } from '$lib/helpers/events.js'
import { delegateEventListeners } from '$lib/helpers/events.js'
import { traveller } from '$lib/helpers/traveller.js'
import { generateId } from '$lib/helpers/uuid.js'
import { activeElement } from '$lib/stores/ActiveElement/activeElement.js'
import { tick } from 'svelte'
import { derived, get, readable, readonly, writable } from 'svelte/store'
import type { Menu, MenuConfig } from './menu.types.js'

export const createMenu = (config?: MenuConfig): Menu => {
  const { disabled, orientation } = { ...config }

  const menuId = generateId()

  const disabled$ = writable(disabled || [])
  const orientation$ = writable(orientation || 'vertical')
  const focused$ = writable<string | null>(null)
  const activePath$ = writable<string[]>([])

  const menuAttrs = derived([orientation$], ([orientation]) => ({
    role: 'menu',
    'aria-orientation': orientation,
    'data-menu': menuId,
  }))

  // TODO: Add support for submenu
  const itemAttrs = derived(
    [focused$, disabled$, activePath$],
    ([focused, disabled, activePath]) =>
      (key: string) => {
        if (!focused) {
          focused$.set(key)
        }
        return {
          role: 'menuitem',
          'data-menu-item': key,
          tabindex: focused === key ? 0 : -1,
          'aria-disabled': disabled.includes(key),
          inert: disabled.includes(key) ? '' : undefined,
        }
      }
  )

  const triggerAttrs = derived(
    [focused$, disabled$, activePath$],
    ([focused, disabled, activePath]) =>
      (key: string) => {
        if (!focused) {
          focused$.set(key)
        }
        return {
          role: 'menuitem',
          'data-menu-item': key,
          'data-menu-trigger': key,
          tabindex: focused === key ? 0 : -1,
          'aria-disabled': disabled.includes(key),
          inert: disabled.includes(key) ? '' : undefined,
          'aria-haspopup': 'menu',
          'aria-expanded': activePath.includes(key) ? 'true' : 'false',
        }
      }
  )

  const submenuAttrs = derived(
    [activePath$, disabled$],
    ([activePath, disabled]) =>
      (key: string) => {
        return {
          role: 'menu',
          'data-menu': menuId,
          'data-menu-parent': menuId,
          'data-menu-submenu': key,
          'aria-orientation': 'vertical',
          'aria-hidden': !activePath.includes(key),
          inert: !activePath.includes(key) ? '' : undefined,
        }
      }
  )

  const separatorAttrs = readable({
    role: 'separator',
  })

  /** Expands the submenu of the given key, and focuses the first item */
  const openSubmenu = (key: string) => {
    activePath$.update((path) => [...path, key])

    tick().then(() => {
      const submenu = menuNode!.querySelector<HTMLElement>(
        `[data-menu-submenu="${key}"]`
      )
      submenu?.querySelector<HTMLElement>('[data-menu-item]')?.focus()
    })
  }

  /** Closes the submenu of the given key, and focuses the parent item back */
  const closeSubmenu = (key: string) => {
    activePath$.update((path) => {
      const index = path.indexOf(key)
      return index > -1 ? path.slice(0, index) : path
    })

    tick().then(() => {
      // Focus the parent item of the submenu
      const parent = menuNode!.querySelector<HTMLElement>(
        `[data-menu-item="${key}"]`
      )
      parent?.focus()
    })
  }

  /** Closes all submenus and set focusable item to the first one */
  const closeAllSubmenus = () => {
    activePath$.set([])

    tick().then(() => {
      const items = traveller(menuNode!, '[data-menu-item]', (el) => {
        return (
          get(disabled$).includes(el.dataset.menuItem!) ||
          el.closest('[data-menu-submenu], [data-menu]') !== menuNode!
        )
      })
      focused$.set(items.first()?.dataset.menuItem || null)
    })
  }

  const onItemClick = (event: DelegateEvent<MouseEvent>) => {
    const key = event.delegateTarget.dataset.menuItem!

    if (get(disabled$).includes(key)) {
      event.preventDefault()
      return
    }

    if (!event.delegateTarget.dataset.menuTrigger) {
      closeAllSubmenus()
    }
  }

  const onItemKeyDown = (event: DelegateEvent<KeyboardEvent>) => {
    const target = event.delegateTarget
    const key = target.dataset.menuItem!
    const $disabled = get(disabled$)

    // Cancel event if item is disabled
    if (['Enter', ' '].includes(event.key) && $disabled.includes(key)) {
      event.preventDefault()
      return
    }

    const $orientation = get(orientation$)

    // Get all the siblings of the current item (considering disabled items and parent menu or submenu)
    const parent = target.closest('[data-menu-submenu], [data-menu]')

    const items = traveller(menuNode!, '[data-menu-item]', (el) => {
      return (
        $disabled.includes(el.dataset.menuItem!) ||
        parent !== el.closest('[data-menu-submenu], [data-menu]')
      )
    })

    if (
      (event.key === 'ArrowLeft' && $orientation === 'horizontal') ||
      (event.key === 'ArrowUp' && $orientation === 'vertical')
    ) {
      event.preventDefault()
      items.previous(target)?.focus()
    }

    if (
      (event.key === 'ArrowRight' && $orientation === 'horizontal') ||
      (event.key === 'ArrowDown' && $orientation === 'vertical')
    ) {
      event.preventDefault()
      items.next(target)?.focus()
    }

    if (event.key === 'Home') {
      event.preventDefault()
      items.first()?.focus()
    }

    if (event.key === 'End') {
      event.preventDefault()
      items.last()?.focus()
    }

    // Trigger submenu actions
    if (target.dataset.menuTrigger) {
      if (
        (event.key === 'ArrowRight' && $orientation === 'vertical') ||
        (event.key === 'ArrowDown' && $orientation === 'horizontal') ||
        ['Enter', ' '].includes(event.key)
      ) {
        event.preventDefault()
        openSubmenu(target.dataset.menuTrigger!)
      }
    }

    if (
      (event.key === 'ArrowLeft' && $orientation === 'vertical') ||
      (event.key === 'ArrowUp' && $orientation === 'horizontal') ||
      event.key === 'Escape'
    ) {
      event.preventDefault()
      const submenu = target.closest<HTMLElement>('[data-menu-submenu]')
      if (submenu) {
        closeSubmenu(submenu.dataset.menuSubmenu!)
      }
    }
  }

  const onItemMouseOver = (event: DelegateEvent<MouseEvent>) => {
    const target = event.delegateTarget

    const parent = target.closest<HTMLElement>(
      '[data-menu-submenu], [data-menu]'
    )

    if (parent === menuNode) {
      activePath$.set([])
    } else if (parent) {
      // Close all submenus siblings
      // FIXME: This is not working properly
      activePath$.update((path) => {
        const index = path.indexOf(parent.dataset.menuSubmenu!)
        return index > -1 ? path.slice(0, index + 1) : path
      })
    }

    if (target.dataset.menuTrigger) {
      openSubmenu(target.dataset.menuTrigger!)
    }
  }

  let menuNode: HTMLElement | null = null

  onBrowserMount(() => {
    menuNode = document.querySelector<HTMLElement>(`[data-menu="${menuId}"]`)

    if (!menuNode) {
      throw new Error('No root node found for the menu')
    }

    const removeListeners = delegateEventListeners(menuNode, {
      click: {
        '[data-menu-item]': onItemClick,
      },
      keydown: {
        '[data-menu-item]': onItemKeyDown,
      },
      mouseover: {
        '[data-menu-item]': onItemMouseOver,
      },
    })

    const unsubscribe = activeElement.subscribe((el) => {
      if (menuNode && el && menuNode.contains(el) && el.dataset.menuItem) {
        focused$.set(el.dataset.menuItem)
      } else {
        closeAllSubmenus()
      }
    })

    return () => {
      removeListeners()
      unsubscribe()
    }
  })

  return {
    disabled: disabled$,
    orientation: orientation$,
    activePath: readonly(activePath$),
    menuAttrs,
    itemAttrs,
    triggerAttrs,
    submenuAttrs,
    separatorAttrs,
  }
}

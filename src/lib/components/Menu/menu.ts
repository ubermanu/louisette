import { delegate } from '$lib/helpers.js'
import type { Action } from 'svelte/action'
import { derived, get, readable, writable } from 'svelte/store'

export type MenuConfig = {
  disabled?: string | string[]
  orientation?: 'horizontal' | 'vertical'
}

export type Menu = ReturnType<typeof createMenu>

export const createMenu = (config?: MenuConfig) => {
  const { disabled, orientation } = { ...config }

  const disabled$ = writable(
    disabled ? (Array.isArray(disabled) ? disabled : [disabled]) : []
  )
  const orientation$ = writable(orientation || 'vertical')

  const menuAttrs = derived([orientation$], ([orientation]) => ({
    role: 'menu',
    'aria-orientation': orientation,
  }))

  // TODO: Handle disabled items
  const itemAttrs = readable((key: string) => ({
    role: 'menuitem',
    'data-menu-item': key,
    tabindex: -1,
  }))

  const separatorAttrs = readable({
    role: 'separator',
  })

  const resolveItemElement = (event: Event) =>
    (event.target as HTMLElement).closest(
      '[data-menu-item]'
    ) as HTMLElement | null

  const onItemClick = (event: MouseEvent) => {
    const target = resolveItemElement(event)
    const key = target?.dataset.menuItem || ''

    if (!key) {
      return
    }

    if (get(disabled$).includes(key)) {
      event.preventDefault()
      return
    }
  }

  const onItemKeyDown = (event: KeyboardEvent) => {
    const target = resolveItemElement(event)
    const key = target?.dataset.menuItem || ''

    if (!key) {
      return
    }

    const $disabled = get(disabled$)

    // Cancel event if item is disabled
    if (['Enter', ' '].includes(event.key) && $disabled.includes(key)) {
      event.preventDefault()
      return
    }

    const $orientation = get(orientation$)

    // TODO: Handle disabled items
    if (
      (event.key === 'ArrowLeft' && $orientation === 'horizontal') ||
      (event.key === 'ArrowUp' && $orientation === 'vertical')
    ) {
      event.preventDefault()
      const previous = target?.previousElementSibling as HTMLElement | null
      previous?.focus()
      return
    }

    // TODO: Handle disabled items
    if (
      (event.key === 'ArrowRight' && $orientation === 'horizontal') ||
      (event.key === 'ArrowDown' && $orientation === 'vertical')
    ) {
      event.preventDefault()
      const next = target?.nextElementSibling as HTMLElement | null
      next?.focus()
      return
    }
  }

  const useMenu: Action = (node) => {
    const events = {
      click: {
        '[data-menu-item]': onItemClick,
      },
      keydown: {
        '[data-menu-item]': onItemKeyDown,
      },
    }

    const removeListeners = delegate(node, events)

    return {
      destroy() {
        removeListeners()
      },
    }
  }

  return {
    disabled: disabled$,
    orientation: orientation$,
    menu: useMenu,
    menuAttrs,
    itemAttrs,
    separatorAttrs,
  }
}

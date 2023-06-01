import type { DelegateEvent } from '$lib/helpers/events.js'
import { delegateEventListeners } from '$lib/helpers/events.js'
import { traveller } from '$lib/helpers/traveller.js'
import { generateId } from '$lib/helpers/uuid.js'
import type { Action } from 'svelte/action'
import { derived, get, readable, writable } from 'svelte/store'

export type MenuConfig = {
  disabled?: string[]
  orientation?: 'horizontal' | 'vertical'
}

export type Menu = ReturnType<typeof createMenu>

export const createMenu = (config?: MenuConfig) => {
  const { disabled, orientation } = { ...config }

  const menuId = generateId()

  const disabled$ = writable(disabled || [])
  const orientation$ = writable(orientation || 'vertical')

  const menuAttrs = derived([orientation$], ([orientation]) => ({
    role: 'menu',
    id: menuId,
    'aria-orientation': orientation,
  }))

  // TODO: Handle disabled items
  const itemAttrs = readable((key: string) => ({
    role: 'menuitem',
    'data-menu-item': key,
    'data-menu': menuId,
    tabindex: -1,
  }))

  const separatorAttrs = readable({
    role: 'separator',
  })

  const onItemClick = (event: DelegateEvent<MouseEvent>) => {
    const target = event.delegateTarget
    const key = target?.dataset.menuItem as string

    if (get(disabled$).includes(key)) {
      event.preventDefault()
      return
    }
  }

  const onItemKeyDown = (event: DelegateEvent<KeyboardEvent>) => {
    const target = event.delegateTarget
    const key = target?.dataset.menuItem as string

    const $disabled = get(disabled$)

    // Cancel event if item is disabled
    if (['Enter', ' '].includes(event.key) && $disabled.includes(key)) {
      event.preventDefault()
      return
    }

    if (!rootNode) {
      console.warn('No root node found for menu')
      return
    }

    const $orientation = get(orientation$)

    const nodes = traveller(
      rootNode,
      `[data-menu-item][data-menu="${menuId}"]`,
      (el) => {
        return $disabled.includes(el.dataset.menuItem as string)
      }
    )

    if (
      (event.key === 'ArrowLeft' && $orientation === 'horizontal') ||
      (event.key === 'ArrowUp' && $orientation === 'vertical')
    ) {
      event.preventDefault()
      nodes.previous(target)?.focus()
    }

    if (
      (event.key === 'ArrowRight' && $orientation === 'horizontal') ||
      (event.key === 'ArrowDown' && $orientation === 'vertical')
    ) {
      event.preventDefault()
      nodes.next(target)?.focus()
    }

    if (event.key === 'Home') {
      event.preventDefault()
      nodes.first()?.focus()
    }

    if (event.key === 'End') {
      event.preventDefault()
      nodes.last()?.focus()
    }
  }

  let rootNode: HTMLElement | null = null

  const useMenu: Action = (node) => {
    rootNode = node

    const removeListeners = delegateEventListeners(node, {
      click: {
        [`[data-menu-item][data-menu="${menuId}"]`]: onItemClick,
      },
      keydown: {
        [`[data-menu-item][data-menu="${menuId}"]`]: onItemKeyDown,
      },
    })

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

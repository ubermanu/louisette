import { delegate } from '$lib/helpers.js'
import type { Action } from 'svelte/action'
import { derived, get, readable, writable } from 'svelte/store'

export type ToolbarConfig = {
  orientation?: 'horizontal' | 'vertical'
}

export const createToolbar = (config?: ToolbarConfig) => {
  const { orientation } = { ...config }

  const orientation$ = writable(orientation || 'horizontal')
  const focused$ = writable('')

  const toolbarAttrs = derived([orientation$], ([orientation]) => ({
    role: 'toolbar',
    'aria-orientation': orientation,
  }))

  const itemAttrs = readable((key: string) => ({
    'data-toolbar-item': key,
    tabIndex: -1,
    inert: '',
  }))

  let rootNode: HTMLElement | null = null

  const onItemKeyDown = (event: KeyboardEvent) => {
    const currentTarget = event.target as HTMLElement

    const items = rootNode?.querySelectorAll(
      '[data-toolbar-item]'
    ) as NodeListOf<HTMLElement>
    if (!items) return

    const currentIndex = Array.from(items).indexOf(currentTarget)
    if (currentIndex === -1) return

    const $orientation = get(orientation$)

    if (
      (event.key === 'ArrowLeft' && $orientation === 'horizontal') ||
      (event.key === 'ArrowUp' && $orientation === 'vertical')
    ) {
      event.preventDefault()
      const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1
      items[prevIndex]?.focus()
    }

    if (
      (event.key === 'ArrowRight' && $orientation === 'horizontal') ||
      (event.key === 'ArrowDown' && $orientation === 'vertical')
    ) {
      event.preventDefault()
      const nextIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1
      items[nextIndex]?.focus()
    }

    if (event.key === 'Home') {
      event.preventDefault()
      items[0]?.focus()
    }

    if (event.key === 'End') {
      event.preventDefault()
      items[items.length - 1]?.focus()
    }
  }

  const useToolbar: Action = (node) => {
    rootNode = node

    const events = {
      keydown: {
        '[data-toolbar-item]': onItemKeyDown,
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
    orientation: orientation$,
    toolbarAttrs,
    itemAttrs,
    toolbar: useToolbar,
  }
}

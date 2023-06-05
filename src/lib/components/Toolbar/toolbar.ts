import type { DelegateEvent } from '$lib/helpers/events.js'
import { delegateEventListeners } from '$lib/helpers/events.js'
import { traveller } from '$lib/helpers/traveller.js'
import { activeElement } from '$lib/index.js'
import type { Action } from 'svelte/action'
import { derived, get, writable } from 'svelte/store'

export type ToolbarConfig = {
  orientation?: 'horizontal' | 'vertical'
}

export type Toolbar = ReturnType<typeof createToolbar>

export const createToolbar = (config?: ToolbarConfig) => {
  const { orientation } = { ...config }

  const orientation$ = writable(orientation || 'horizontal')

  const toolbarAttrs = derived([orientation$], ([orientation]) => ({
    role: 'toolbar',
    'aria-orientation': orientation,
  }))

  // The last focused item key in the toolbar
  const focused$ = writable<string | null>(null)

  const itemAttrs = derived([focused$], ([focused]) => {
    return (key: string) => {
      // Find a prettier way to do this (causes a re-render)
      if (!focused) {
        focused$.set(key)
      }
      return {
        'data-toolbar-item': key,
        tabIndex: focused === key ? 0 : -1,
      }
    }
  })

  let rootNode: HTMLElement | null = null

  const onItemKeyDown = (event: DelegateEvent<KeyboardEvent>) => {
    const target = event.delegateTarget

    if (!rootNode) {
      console.warn('Toolbar root node not found.')
      return
    }

    // TODO: Handle disabled items
    const nodes = traveller(rootNode, '[data-toolbar-item]')
    const $orientation = get(orientation$)

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

  const useToolbar: Action = (node) => {
    rootNode = node

    const removeListeners = delegateEventListeners(node, {
      keydown: {
        '[data-toolbar-item]': onItemKeyDown,
      },
    })

    const unsubscribe = activeElement.subscribe((el) => {
      if (rootNode && el && rootNode.contains(el)) {
        focused$.set(el.dataset.toolbarItem || null)
      }
    })

    return {
      destroy() {
        removeListeners()
        unsubscribe()
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

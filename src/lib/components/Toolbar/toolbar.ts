import type { DelegateEvent } from '$lib/helpers/events.js'
import { delegateEventListeners } from '$lib/helpers/events.js'
import { traveller } from '$lib/helpers/traveller.js'
import type { Action } from 'svelte/action'
import { derived, get, readable, writable } from 'svelte/store'

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

  // The key of the first rendered item (not disabled)
  // FIXME: This is a really hacky way to do this
  let firstItemKey: string | undefined

  const isFocusable = (key: string) => {
    return firstItemKey === key
  }

  const itemAttrs = readable((key: string) => {
    if (!firstItemKey) {
      firstItemKey = key
    }
    return {
      'data-toolbar-item': key,
      tabIndex: isFocusable(key) ? 0 : -1,
    }
  })

  let rootNode: HTMLElement | null = null

  const onItemKeyDown = (event: DelegateEvent<KeyboardEvent>) => {
    const target = event.delegateTarget

    if (!rootNode) {
      console.warn('Toolbar root node not found.')
      return
    }

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

import { onBrowserMount } from '$lib/helpers/environment.js'
import type { DelegateEvent } from '$lib/helpers/events.js'
import { delegateEventListeners } from '$lib/helpers/events.js'
import { traveller } from '$lib/helpers/traveller.js'
import { generateId } from '$lib/helpers/uuid.js'
import { activeElement } from '$lib/index.js'
import { derived, get, writable } from 'svelte/store'
import type { Toolbar, ToolbarConfig } from './toolbar.types.js'

export const createToolbar = (config?: ToolbarConfig): Toolbar => {
  const { orientation } = { ...config }

  const orientation$ = writable(orientation || 'horizontal')

  const baseId = generateId()

  const toolbarAttrs = derived([orientation$], ([orientation]) => ({
    role: 'toolbar',
    'aria-orientation': orientation,
    'data-toolbar': baseId,
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

  const onItemKeyDown = (event: DelegateEvent<KeyboardEvent>) => {
    const target = event.delegateTarget

    // TODO: Handle disabled items
    const nodes = traveller(toolbarNode!, '[data-toolbar-item]')
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

  let toolbarNode: HTMLElement | null = null

  onBrowserMount(() => {
    toolbarNode = document.querySelector<HTMLElement>(
      `[data-toolbar="${baseId}"]`
    )

    if (!toolbarNode) {
      throw new Error('Could not find the node for the toolbar')
    }

    const removeListeners = delegateEventListeners(toolbarNode, {
      keydown: {
        '[data-toolbar-item]': onItemKeyDown,
      },
    })

    const unsubscribe = activeElement.subscribe((el) => {
      if (toolbarNode && el && toolbarNode.contains(el)) {
        focused$.set(el.dataset.toolbarItem || null)
      }
    })

    return () => {
      removeListeners()
      unsubscribe()
    }
  })

  return {
    orientation: orientation$,
    toolbarAttrs,
    itemAttrs,
  }
}

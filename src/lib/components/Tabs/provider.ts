import { generateId } from '$lib/helpers.js'
import type { Action } from 'svelte/action'
import { derived, get, writable } from 'svelte/store'

type TabsConfig = {
  orientation?: 'horizontal' | 'vertical'
  behavior?: 'manual' | 'auto'
}

type TabConfig = {
  key: string
  selected?: boolean
  disabled?: boolean
}

type PanelConfig = {
  key: string
}

type Tab = {
  id: string
  disabled: boolean
  key: string
  triggerElement?: HTMLElement
}

type Panel = {
  id: string
  key: string
  element?: HTMLElement
}

export const createTabsProvider = (config?: TabsConfig) => {
  // The currently selected identifier
  const selected = writable<string>('')

  const tabs = writable<Tab[]>([])
  const panels = writable<Panel[]>([])

  const orientation = writable(config?.orientation || 'horizontal')
  const behavior = writable(config?.behavior || 'auto')

  /** Open a panel by id */
  const openTab = (id: string) => {
    selected.set(id)
  }

  const listState = derived(
    [orientation, behavior],
    ([$orientation, $behavior]) => {
      return {
        orientation: $orientation,
        behavior: $behavior,
      }
    }
  )

  /** The action to be applied to the tab list element */
  const listRef: Action = (node) => {
    node.setAttribute('role', 'tablist')

    const unsubscribe = listState.subscribe(($state) => {
      node.setAttribute('aria-orientation', $state.orientation || 'horizontal')
    })

    return {
      destroy: () => {
        unsubscribe()
      },
    }
  }

  const createItemProvider = (config: TabConfig) => {
    const tabId = generateId()

    const disabled = writable<boolean>(config?.disabled || false)

    tabs.update(($items) => {
      return [
        ...$items,
        {
          id: tabId,
          disabled: config?.disabled || false,
          key: config.key,
        },
      ]
    })

    if (config?.selected) {
      openTab(config.key)
    }

    const tabState = derived([disabled, selected], ([$disabled, $selected]) => {
      return {
        active: $selected === config.key,
        disabled: $disabled,
      }
    })

    /** The action to be applied to the tab element */
    const triggerRef: Action = (node) => {
      node.setAttribute('id', tabId)
      node.setAttribute('role', 'tab')

      // Attach the node to the tab entry
      tabs.update(($items) => {
        return $items.map((item) => {
          if (item.id === tabId) {
            return {
              ...item,
              triggerElement: node,
            }
          }
          return item
        })
      })

      // This handles the case where there are multiple panels with the same key
      node.setAttribute(
        'aria-controls',
        get(panels)
          .filter((panel) => panel.key === config.key)
          .map((panel) => panel.id)
          .join(' ')
      )

      function onClick() {
        if (get(tabState).disabled) return
        openTab(config.key)
      }

      function onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }

        const $orientation = get(orientation)

        if (event.key === 'ArrowLeft' && $orientation === 'horizontal') {
          event.preventDefault()
          // TODO: Get the previous enabled tab
        }

        if (event.key === 'ArrowRight' && $orientation === 'horizontal') {
          event.preventDefault()
          // TODO: Get the next enabled tab
        }

        if (event.key === 'ArrowUp' && $orientation === 'vertical') {
          event.preventDefault()
          // TODO: Get the previous enabled tab
        }

        if (event.key === 'ArrowDown' && $orientation === 'vertical') {
          event.preventDefault()
          // TODO: Get the next enabled tab
        }

        if (event.key === 'Home') {
          event.preventDefault()
          // TODO: Get the first enabled tab
        }

        if (event.key === 'End') {
          event.preventDefault()
          // TODO: Get the last enabled tab
        }
      }

      function onFocus() {
        if (get(listState).behavior === 'manual') return
        if (get(tabState).disabled) return
        openTab(config.key)
      }

      node.addEventListener('click', onClick)
      node.addEventListener('keydown', onKeyDown)
      node.addEventListener('focus', onFocus)

      const unsubscribe = tabState.subscribe(($state) => {
        node.setAttribute('aria-selected', $state.active.toString())
        node.setAttribute('aria-disabled', $state.disabled.toString())
        node.setAttribute('tabindex', $state.active ? '0' : '-1')
      })

      return {
        destroy: () => {
          node.removeEventListener('click', onClick)
          node.removeEventListener('keydown', onKeyDown)
          node.removeEventListener('focus', onFocus)
          unsubscribe()
        },
      }
    }

    return {
      state: tabState,
      triggerRef,
    }
  }

  const createPanelProvider = (config: PanelConfig) => {
    const panelId = generateId()

    panels.update(($items) => {
      return [
        ...$items,
        {
          id: panelId,
          active: false,
          key: config.key,
        },
      ]
    })

    if (get(panels).length === 1 && !get(selected)) {
      openTab(config.key)
    }

    const panelState = derived([selected], ([$selected]) => {
      return {
        active: $selected === config.key,
      }
    })

    /** The action to be applied to the tab panel element */
    const panelRef: Action = (node) => {
      node.setAttribute('id', panelId)
      node.setAttribute('role', 'tabpanel')

      // Attach the panel to the tab, based on the tab key
      // This handles the case where there are multiple tabs with the same key
      node.setAttribute(
        'aria-labelledby',
        get(tabs)
          .filter((tab) => tab.key === config.key)
          .map((tab) => tab.id)
          .join(' ')
      )

      const unsubscribe = panelState.subscribe(($state) => {
        node.setAttribute('aria-hidden', (!$state.active).toString())
      })

      return {
        destroy: () => {
          unsubscribe()
        },
      }
    }

    return {
      state: panelState,
      panelRef,
    }
  }

  return {
    state: listState,
    listRef,
    createItemProvider,
    createPanelProvider,
  }
}

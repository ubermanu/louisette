import { generateId } from '$lib/helpers.js'
import { v4 as uuid } from '@lukeed/uuid'
import type { Action } from 'svelte/action'
import { derived, get, writable } from 'svelte/store'

type TabsConfig = {
  orientation?: 'horizontal' | 'vertical'
  behavior?: 'manual' | 'auto'
}

type TabItemConfig = {
  key: string
  selected?: boolean
  disabled?: boolean
}

type PanelItemConfig = {
  key: string
}

type TabItem = {
  id: string
  disabled: boolean
  key: string
  triggerElement?: HTMLElement
}

type PanelItem = {
  id: string
  key: string
  element?: HTMLElement
}

export const createTabsProvider = (config?: TabsConfig) => {
  // The currently selected identifier
  const selected = writable<string>('')

  const tabs = writable<TabItem[]>([])
  const panels = writable<PanelItem[]>([])

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

  const listAction: Action = (node) => {
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

  const createItemProvider = (config: TabItemConfig) => {
    const id = uuid()
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

    const itemState = derived(
      [disabled, selected],
      ([$disabled, $selected]) => {
        return {
          active: $selected === config.key,
          disabled: $disabled,
        }
      }
    )

    const itemAction: Action = (node) => {
      node.setAttribute('id', tabId)
      node.setAttribute('role', 'tab')
      node.setAttribute(
        'aria-controls',
        get(panels).find((panel) => panel.key === config.key)?.id || ''
      )

      function onClick() {
        if (get(itemState).disabled) return
        openTab(config.key)
      }

      node.addEventListener('click', onClick)

      const unsubscribe = itemState.subscribe(($state) => {
        node.setAttribute('aria-selected', $state.active.toString())
        node.setAttribute('aria-disabled', $state.disabled.toString())
      })

      return {
        destroy: () => {
          node.removeEventListener('click', onClick)
          unsubscribe()
        },
      }
    }

    return {
      state: itemState,
      triggerRef: itemAction,
    }
  }

  const createPanelProvider = (config: PanelItemConfig) => {
    const id = uuid()
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

    const panelAction: Action = (node) => {
      node.setAttribute('id', panelId)
      node.setAttribute('role', 'tabpanel')
      node.setAttribute(
        'aria-labelledby',
        get(tabs).find((tab) => tab.key === config.key)?.id || ''
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
      panelRef: panelAction,
    }
  }

  return {
    state: listState,
    listRef: listAction,
    createItemProvider,
    createPanelProvider,
  }
}

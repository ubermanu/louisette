import { generateId } from '$lib/helpers.js'
import type { Action } from 'svelte/action'
import { derived, get, writable } from 'svelte/store'

type TabsConfig = {
  orientation?: 'horizontal' | 'vertical'
  behavior?: 'manual' | 'auto'
}

type Tab = {
  id: string
  key: string
  element?: HTMLElement
}

type Panel = {
  id: string
  key: string
  element?: HTMLElement
}

type TabAttrs = {
  key: string
  selected?: boolean
  disabled?: boolean
}

type PanelAttrs = {
  key: string
}

export const createTabs = (config?: TabsConfig) => {
  const orientation = writable(config?.orientation || 'horizontal')
  const behavior = writable(config?.behavior || 'manual')

  const selected = writable<string>('')
  const disabled = writable<string[]>([])

  const tabs = writable<Tab[]>([])
  const panels = writable<Panel[]>([])

  const state = derived(
    [orientation, behavior, selected, disabled, tabs, panels],
    ([$orientation, $behavior, $selected, $disabled, $tabs, $panels]) => {
      return {
        orientation: $orientation,
        behavior: $behavior,
        selected: $selected,
        disabled: $disabled,
        tabs: $tabs,
        panels: $panels,
      }
    }
  )

  /** Open a panel by id */
  const openTab = (id: string) => {
    selected.set(id)
  }

  /** TODO: Optimize this */
  const getPrevEnabledTab = (id: string): Tab | null => {
    const $tabs = get(tabs)
    const index = $tabs.findIndex(($tab) => $tab.id === id)
    const prevTab = $tabs[index - 1]
    if (!prevTab) return null
    if (get(disabled).includes(prevTab.key)) {
      return getPrevEnabledTab(prevTab.id)
    }
    return prevTab
  }

  /** TODO: Optimize this */
  const getNextEnabledTab = (id: string): Tab | null => {
    const $tabs = get(tabs)
    const index = $tabs.findIndex(($tab) => $tab.id === id)
    const nextTab = $tabs[index + 1]
    if (!nextTab) return null
    if (get(disabled).includes(nextTab.key)) {
      return getNextEnabledTab(nextTab.id)
    }
    return nextTab
  }

  /** TODO: Optimize this */
  const getFirstEnabledTab = () => {
    const $tabs = get(tabs)
    const firstTab = $tabs[0]
    if (!firstTab) return null
    if (get(disabled).includes(firstTab.key)) {
      return getNextEnabledTab(firstTab.id)
    }
    return firstTab
  }

  /** TODO: Optimize this */
  const getLastEnabledTab = () => {
    const $tabs = get(tabs)
    const lastTab = $tabs[$tabs.length - 1]
    if (!lastTab) return null
    if (get(disabled).includes(lastTab.key)) {
      return getPrevEnabledTab(lastTab.id)
    }
    return lastTab
  }

  /** The action to be applied to the tab list element */
  const listRef: Action = (node) => {
    node.setAttribute('role', 'tablist')

    const unsubscribe = orientation.subscribe(($orientation) => {
      node.setAttribute('aria-orientation', $orientation || 'horizontal')
    })

    return {
      destroy: () => {
        unsubscribe()
      },
    }
  }

  const tabRef: Action = (node, attrs?: TabAttrs) => {
    const tabId = generateId()

    if (!attrs || !attrs.key) {
      throw new Error('Tab key is required')
    }

    const { key } = attrs

    // Attach the node to the tab entry
    tabs.update(($tabs) => [...$tabs, { id: tabId, key, element: node }])

    // Set the disabled tab
    if (attrs.disabled) {
      disabled.update(($disabled) => [...$disabled, key])
    }

    // Set the selected tab
    if (attrs.selected) {
      selected.set(key)
    }

    // Set the first tab as selected if none are selected
    if (!get(selected)) {
      selected.set(key)
    }

    node.setAttribute('id', tabId)
    node.setAttribute('role', 'tab')

    // This handles the case where there are multiple panels with the same key
    node.setAttribute(
      'aria-controls',
      get(panels)
        .filter((panel) => panel.key === key)
        .map((panel) => panel.id)
        .join(' ')
    )

    function onClick() {
      if (get(disabled).includes(key)) return
      openTab(key)
    }

    function onKeyDown(event: KeyboardEvent) {
      const $orientation = get(orientation)
      const $behavior = get(behavior)

      if (
        (event.key === 'Enter' || event.key === ' ') &&
        $behavior === 'manual'
      ) {
        event.preventDefault()
        onClick()
      }

      if (event.key === 'ArrowLeft' && $orientation === 'horizontal') {
        event.preventDefault()
        getPrevEnabledTab(tabId)?.element?.focus()
      }

      if (event.key === 'ArrowRight' && $orientation === 'horizontal') {
        event.preventDefault()
        getNextEnabledTab(tabId)?.element?.focus()
      }

      if (event.key === 'ArrowUp' && $orientation === 'vertical') {
        event.preventDefault()
        getPrevEnabledTab(tabId)?.element?.focus()
      }

      if (event.key === 'ArrowDown' && $orientation === 'vertical') {
        event.preventDefault()
        getNextEnabledTab(tabId)?.element?.focus()
      }

      if (event.key === 'Home') {
        event.preventDefault()
        getFirstEnabledTab()?.element?.focus()
      }

      if (event.key === 'End') {
        event.preventDefault()
        getLastEnabledTab()?.element?.focus()
      }
    }

    function onFocus() {
      if (get(behavior) === 'manual') return
      if (get(disabled).includes(key)) return
      openTab(key)
    }

    node.addEventListener('click', onClick)
    node.addEventListener('keydown', onKeyDown)
    node.addEventListener('focus', onFocus)

    const unsubscribe = selected.subscribe(($selected) => {
      const active = $selected === key
      node.setAttribute('aria-selected', active.toString())
      node.setAttribute('tabindex', active ? '0' : '-1')
    })

    const unsubscribe2 = disabled.subscribe(($disabled) => {
      node.setAttribute('aria-disabled', $disabled.includes(key).toString())
    })

    return {
      destroy: () => {
        node.removeEventListener('click', onClick)
        node.removeEventListener('keydown', onKeyDown)
        node.removeEventListener('focus', onFocus)
        unsubscribe()
        unsubscribe2()
      },
    }
  }

  /** The action to be applied to the tab panel element */
  const panelRef: Action = (node, attrs?: PanelAttrs) => {
    const panelId = generateId()

    if (!attrs || !attrs.key) {
      throw new Error('Tab panel must have a key')
    }

    const { key } = attrs

    // Push the panel to its store
    panels.update(($panels) => [
      ...$panels,
      { id: panelId, key, element: node },
    ])

    node.setAttribute('id', panelId)
    node.setAttribute('role', 'tabpanel')

    // Attach the panel to the tab, based on the tab key
    // This handles the case where there are multiple tabs with the same key
    node.setAttribute(
      'aria-labelledby',
      get(tabs)
        .filter((tab) => tab.key === key)
        .map((tab) => tab.id)
        .join(' ')
    )

    const unsubscribe = selected.subscribe(($state) => {
      node.setAttribute('aria-hidden', ($state !== key).toString())
    })

    return {
      destroy: () => {
        panels.update(($panels) =>
          $panels.filter(($panel) => $panel.id !== panelId)
        )
        unsubscribe()
      },
    }
  }

  return {
    state,
    listRef,
    panelRef,
    tabRef,
  }
}

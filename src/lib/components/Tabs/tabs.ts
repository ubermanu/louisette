import type { DelegateEvent } from '$lib/helpers/events.js'
import { delegateEventListeners } from '$lib/helpers/events.js'
import { traveller } from '$lib/helpers/traveller.js'
import type { Action } from 'svelte/action'
import { derived, get, readonly, writable } from 'svelte/store'
import type { Tabs, TabsConfig } from './tabs.types.js'

export const createTabs = (config?: TabsConfig): Tabs => {
  const { active, disabled, orientation, behavior } = { ...config }

  const active$ = writable(active || '')
  const disabled$ = writable(
    disabled ? (Array.isArray(disabled) ? disabled : [disabled]) : []
  )

  const orientation$ = writable(orientation || 'horizontal')
  const behavior$ = writable(behavior || 'auto')

  const listAttrs = derived([orientation$], ([orientation]) => ({
    role: 'tablist',
    'aria-orientation': orientation,
  }))

  let defaultActive = active || ''

  const tabAttrs = derived(
    [active$, disabled$],
    ([active, disabled]) =>
      (key: string) => {
        // TODO: Check if there is a better way to do this
        if (!defaultActive && !disabled.includes(String(key))) {
          defaultActive = String(key)
          active$.set(defaultActive)
        }

        return {
          role: 'tab',
          'aria-selected': active === String(key),
          'aria-disabled': disabled.includes(String(key)),
          'data-tabs-tab': key,
          tabIndex: active === String(key) ? 0 : -1,
        }
      }
  )

  const panelAttrs = derived([active$], ([active]) => (key: string) => ({
    role: 'tabpanel',
    'data-tabs-panel': key,
    inert: active !== String(key) ? '' : undefined,
  }))

  // TODO: Select the first enabled tab if no active tab

  const open = (key: string) => {
    if (!key || get(disabled$).includes(key)) return
    active$.set(key)
  }

  const onTabClick = (event: DelegateEvent<MouseEvent>) => {
    open(event.delegateTarget.dataset.tabsTab as string)
  }

  const onTabKeyDown = (event: DelegateEvent<KeyboardEvent>) => {
    const target = event.delegateTarget
    const key = (event.target as HTMLElement).dataset.tabsTab || ''

    const $orientation = get(orientation$)
    const $behavior = get(behavior$)

    if (['Enter', ' '].includes(event.key) && $behavior === 'manual') {
      event.preventDefault()
      open(key)
    }

    if (!rootNode) {
      console.warn('Tabs root node not found.')
      return
    }

    const $disabled = get(disabled$)

    const nodes = traveller(rootNode, '[data-tabs-tab]', (el) => {
      return $disabled.includes(el.dataset.tabsTab as string)
    })

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

  const onTabFocus = (event: FocusEvent) => {
    if (get(behavior$) === 'auto') {
      const key = (event.target as HTMLElement).dataset.tabsTab || ''
      open(key)
    }
  }

  let rootNode: HTMLElement | null = null

  const useTabs: Action = (node) => {
    rootNode = node

    const removeListeners = delegateEventListeners(node, {
      click: {
        '[data-tabs-tab]': onTabClick,
      },
      keydown: {
        '[data-tabs-tab]': onTabKeyDown,
      },
      focusin: {
        '[data-tabs-tab]': onTabFocus,
      },
    })

    return {
      destroy() {
        removeListeners()
      },
    }
  }

  return {
    active: readonly(active$),
    disabled: disabled$,
    orientation: orientation$,
    listAttrs,
    tabAttrs,
    panelAttrs,
    tabs: useTabs,
    open,
  }
}

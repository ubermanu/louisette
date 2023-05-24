import { delegate } from '$lib/helpers.js'
import type { Action } from 'svelte/action'
import { derived, get, readonly, writable } from 'svelte/store'

export type TabsConfig = {
  /** The key of the active panel. */
  active?: string

  /** The key of the disabled panels. */
  disabled?: string | string[]

  /** The orientation of the tabs. */
  orientation?: 'horizontal' | 'vertical'

  /** The behavior of the tabs. */
  behavior?: 'auto' | 'manual'
}

export const createTabs = (config?: TabsConfig) => {
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

  const tabAttrs = derived(
    [active$, disabled$],
    ([active, disabled]) =>
      (key: string) => ({
        role: 'tab',
        'aria-selected': active === String(key),
        'aria-disabled': disabled.includes(String(key)),
        'data-tabs-tab': key,
        tabIndex: active === String(key) ? 0 : -1,
      })
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

  const onTabClick = (event: MouseEvent) => {
    const key = (event.target as HTMLElement).dataset.tabsTab || ''
    open(key)
  }

  const onTabKeyDown = (event: KeyboardEvent) => {
    const key = (event.target as HTMLElement).dataset.tabsTab || ''

    const $orientation = get(orientation$)
    const $behavior = get(behavior$)

    if (['Enter', ' '].includes(event.key) && $behavior === 'manual') {
      event.preventDefault()
      open(key)
    }

    const tabs = Array.from(
      rootNode?.querySelectorAll('[data-tabs-tab]') || []
    ) as HTMLElement[]

    if (
      (event.key === 'ArrowLeft' && $orientation === 'horizontal') ||
      (event.key === 'ArrowUp' && $orientation === 'vertical')
    ) {
      event.preventDefault()
      const prevIndex = tabs.indexOf(event.target as HTMLElement) - 1
      tabs[prevIndex]?.focus()
    }

    if (
      (event.key === 'ArrowRight' && $orientation === 'horizontal') ||
      (event.key === 'ArrowDown' && $orientation === 'vertical')
    ) {
      event.preventDefault()
      const nextIndex = tabs.indexOf(event.target as HTMLElement) + 1
      tabs[nextIndex]?.focus()
    }

    if (event.key === 'Home') {
      event.preventDefault()
      tabs[0]?.focus()
    }

    if (event.key === 'End') {
      event.preventDefault()
      tabs[tabs.length - 1]?.focus()
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

    const events = {
      click: {
        '[data-tabs-tab]': onTabClick,
      },
      keydown: {
        '[data-tabs-tab]': onTabKeyDown,
      },
      focus: {
        '[data-tabs-tab]': onTabFocus,
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

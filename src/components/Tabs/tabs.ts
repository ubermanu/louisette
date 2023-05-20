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
  behavior: 'auto' | 'manual'
}

export const createTabs = (config?: TabsConfig) => {
  const { active, disabled, orientation, behavior } = { ...config }

  const active$ = writable(active || '')
  const disabled$ = writable(
    disabled ? (Array.isArray(disabled) ? disabled : [disabled]) : []
  )

  const orientation$ = writable(orientation || 'horizontal')
  const behavior$ = writable(behavior || 'auto')

  const listProps = derived([orientation$], ([orientation]) => ({
    role: 'tablist',
    'aria-orientation': orientation,
  }))

  const tabProps = derived(
    [active$, disabled$],
    ([active, disabled]) =>
      (key: string) => ({
        role: 'tab',
        'aria-selected': active === key,
        'aria-disabled': disabled.includes(key),
        'data-tabs-tab': key,
        tabIndex: active === key ? 0 : -1,
      })
  )

  const panelProps = derived([active$], ([active]) => (key: string) => ({
    role: 'tabpanel',
    'data-tabs-panel': key,
    inert: active !== key ? '' : undefined,
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

    if (
      (event.key === 'ArrowLeft' && $orientation === 'horizontal') ||
      (event.key === 'ArrowUp' && $orientation === 'vertical')
    ) {
      event.preventDefault()
      // TODO: Focus the previous enabled tab
    }

    if (
      (event.key === 'ArrowRight' && $orientation === 'horizontal') ||
      (event.key === 'ArrowDown' && $orientation === 'vertical')
    ) {
      event.preventDefault()
      // TODO: Focus the next enabled tab
    }

    if (event.key === 'Home') {
      event.preventDefault()
      // TODO: Focus the first enabled tab
    }

    if (event.key === 'End') {
      event.preventDefault()
      // TODO: Focus the last enabled tab
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
    listProps,
    tabProps,
    panelProps,
    open,
  }
}

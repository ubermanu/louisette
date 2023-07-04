import { onBrowserMount } from '$lib/helpers/environment.js'
import type { DelegateEvent } from '$lib/helpers/events.js'
import { delegateEventListeners } from '$lib/helpers/events.js'
import { traveller } from '$lib/helpers/traveller.js'
import { generateId } from '$lib/helpers/uuid.js'
import { derived, get, readable, readonly, writable } from 'svelte/store'
import type { Tabs, TabsConfig } from './tabs.types.js'

export const createTabs = (config?: TabsConfig): Tabs => {
  const { active, disabled, orientation, behavior } = { ...config }

  const active$ = writable(active || '')
  const disabled$ = writable(
    disabled ? (Array.isArray(disabled) ? disabled : [disabled]) : []
  )

  const orientation$ = writable(orientation || 'horizontal')
  const behavior$ = writable(behavior || 'auto')

  const baseId = generateId()
  const tabId = (key: string) => `${baseId}-tab-${key}`
  const panelId = (key: string) => `${baseId}-panel-${key}`

  const rootAttrs = readable({
    'data-tabs': baseId,
  })

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
          id: tabId(key),
          'aria-selected': active === String(key),
          'aria-disabled': disabled.includes(String(key)),
          'data-tabs-tab': key,
          tabIndex: active === String(key) ? 0 : -1,
          'aria-controls': panelId(key),
        }
      }
  )

  const panelAttrs = derived([active$], ([active]) => (key: string) => ({
    role: 'tabpanel',
    id: panelId(key),
    'data-tabs-panel': key,
    inert: active !== String(key) ? '' : undefined,
    'aria-labelledby': tabId(key),
  }))

  // TODO: Select the first enabled tab if no active tab

  const open = (key: string) => {
    if (!key || get(disabled$).includes(key)) return
    active$.set(key)
  }

  const onTabClick = (event: DelegateEvent<MouseEvent>) => {
    open(event.delegateTarget.dataset.tabsTab!)
  }

  const onTabKeyDown = (event: DelegateEvent<KeyboardEvent>) => {
    const target = event.delegateTarget

    const $orientation = get(orientation$)
    const $behavior = get(behavior$)

    if (['Enter', ' '].includes(event.key) && $behavior === 'manual') {
      event.preventDefault()
      open(target.dataset.tabsTab!)
      return
    }

    const $disabled = get(disabled$)

    const nodes = traveller(rootNode!, '[data-tabs-tab]', (el) => {
      return $disabled.includes(el.dataset.tabsTab!)
    })

    if (
      (event.key === 'ArrowLeft' && $orientation === 'horizontal') ||
      (event.key === 'ArrowUp' && $orientation === 'vertical')
    ) {
      event.preventDefault()
      nodes.previous(target)?.focus()
      return
    }

    if (
      (event.key === 'ArrowRight' && $orientation === 'horizontal') ||
      (event.key === 'ArrowDown' && $orientation === 'vertical')
    ) {
      event.preventDefault()
      nodes.next(target)?.focus()
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      nodes.first()?.focus()
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      nodes.last()?.focus()
      return
    }
  }

  const onTabFocus = (event: DelegateEvent<FocusEvent>) => {
    if (get(behavior$) === 'auto') {
      open(event.delegateTarget.dataset.tabsTab!)
    }
  }

  let rootNode: HTMLElement | null = null

  onBrowserMount(() => {
    rootNode = document.querySelector<HTMLElement>(`[data-tabs="${baseId}"]`)

    if (!rootNode) {
      throw new Error('No root node found for the tabs')
    }

    return delegateEventListeners(rootNode, {
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
  })

  return {
    active: readonly(active$),
    disabled: disabled$,
    orientation: orientation$,
    rootAttrs,
    listAttrs,
    tabAttrs,
    panelAttrs,
    open,
  }
}

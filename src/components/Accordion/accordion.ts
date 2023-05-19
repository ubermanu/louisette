import { delegate, generateId } from '$lib/helpers.js'
import type { Action } from 'svelte/action'
import { derived, get, readonly, writable } from 'svelte/store'

export type AccordionConfig = {
  expanded?: string[] | string
  disabled?: string[]
  multiple?: boolean
}

export const createAccordion = (config: AccordionConfig) => {
  const { multiple, expanded, disabled } = {
    multiple: false,
    ...config,
  }

  const multiple$ = writable(multiple || false)
  const expanded$ = writable(
    expanded ? (Array.isArray(expanded) ? expanded : [expanded]) : []
  )
  const disabled$ = writable(disabled || [])

  const baseId = generateId()
  const getTriggerId = (key: string) => `${baseId}-trigger-${key}`
  const getContentId = (key: string) => `${baseId}-content-${key}`

  const triggerProps = derived(
    [expanded$, disabled$],
    ([expanded, disabled]) => {
      return (key: string) => ({
        id: getTriggerId(key),
        role: 'button',
        'aria-controls': getContentId(key),
        'aria-expanded': expanded.includes(key),
        'aria-disabled': disabled.includes(key),
        tabIndex: disabled.includes(key) ? -1 : 0,
        'data-accordion-trigger': key,
      })
    }
  )

  const contentProps = derived([expanded$], ([expanded]) => {
    return (key: string) => ({
      id: getContentId(key),
      role: 'region',
      'aria-labelledby': getTriggerId(key),
      'aria-hidden': !expanded.includes(key),
      'data-accordion-content': key,
    })
  })

  const expand = (key: string) => {
    if (!key || get(disabled$).includes(key)) return
    expanded$.update((expanded) => {
      if (expanded.includes(key)) return expanded
      return multiple ? [...expanded, key] : [key]
    })
  }

  const collapse = (key: string) => {
    if (!key || get(disabled$).includes(key)) return
    expanded$.update((expanded) => {
      if (!expanded.includes(key)) return expanded
      return expanded.filter((e) => e !== key)
    })
  }

  const toggle = (key: string) => {
    if (!key || get(disabled$).includes(key)) return
    expanded$.update((expanded) => {
      if (expanded.includes(key)) {
        return expanded.filter((e) => e !== key)
      }
      return multiple ? [...expanded, key] : [key]
    })
  }

  const expandAll = () => {
    const triggers = rootNode?.querySelectorAll(
      '[data-accordion-trigger]'
    ) as NodeListOf<HTMLElement>

    const $disabled = get(disabled$)

    const keys = Array.from(triggers)
      .map((trigger) => trigger.dataset.accordionTrigger || '')
      .filter((key) => key && !$disabled.includes(key))

    expanded$.set(keys)
  }

  const collapseAll = () => {
    expanded$.set([])
  }

  let rootNode: HTMLElement | null = null

  // TODO: Handle the case where the accordion is inside another accordion
  function getTrigger(event: Event) {
    const path = event.composedPath()
    const node = path.find(
      (el) =>
        el instanceof HTMLElement && el.hasAttribute('data-accordion-trigger')
    )
    return node as HTMLElement | undefined
  }

  const useAccordion: Action = (node) => {
    rootNode = node

    const events = {
      keydown: {
        '[data-accordion-trigger]': onTriggerKeyDown,
      },
      click: {
        '[data-accordion-trigger]': onTriggerClick,
      },
    }

    const removeListeners = delegate(node, events)

    return {
      destroy() {
        removeListeners()
      },
    }
  }

  const onTriggerClick = (event: MouseEvent) => {
    event.preventDefault()
    toggle(getTrigger(event)?.dataset.accordionTrigger || '')
  }

  /** Get the previous enabled trigger that is not disabled */
  const getPrevEnabledTrigger = (key: string): HTMLElement | null => {
    if (!rootNode || !key) {
      return null
    }

    const triggers = rootNode.querySelectorAll(
      '[data-accordion-trigger]'
    ) as NodeListOf<HTMLElement>

    const index = Array.from(triggers).findIndex(
      (el) => el.dataset.accordionTrigger === key
    )

    if (index === -1) {
      return null
    }

    const $disabled = get(disabled$)

    const prev = Array.from(triggers)
      .slice(0, index)
      .reverse()
      .find((el) => {
        const key = el.dataset.accordionTrigger
        return key && !$disabled.includes(key)
      })

    return prev || null
  }

  /** Get the next enabled trigger that is not disabled */
  const getNextEnabledTrigger = (key: string): HTMLElement | null => {
    if (!rootNode || !key) {
      return null
    }

    const triggers = rootNode.querySelectorAll(
      '[data-accordion-trigger]'
    ) as NodeListOf<HTMLElement>

    const index = Array.from(triggers).findIndex(
      (el) => el.dataset.accordionTrigger === key
    )

    if (index === -1) {
      return null
    }

    const $disabled = get(disabled$)

    const next = Array.from(triggers)
      .slice(index + 1)
      .find((el) => {
        const key = el.dataset.accordionTrigger
        return key && !$disabled.includes(key)
      })

    return next || null
  }

  /** Get the first enabled trigger that is not disabled */
  const getFirstEnabledTrigger = (): HTMLElement | null => {
    if (!rootNode) {
      return null
    }

    const triggers = rootNode.querySelectorAll(
      '[data-accordion-trigger]'
    ) as NodeListOf<HTMLElement>

    const $disabled = get(disabled$)

    const first = Array.from(triggers).find((el) => {
      const key = el.dataset.accordionTrigger
      return key && !$disabled.includes(key)
    })

    return first || null
  }

  const getLastEnabledTrigger = (): HTMLElement | null => {
    if (!rootNode) {
      return null
    }

    const triggers = rootNode.querySelectorAll(
      '[data-accordion-trigger]'
    ) as NodeListOf<HTMLElement>

    const $disabled = get(disabled$)

    const last = Array.from(triggers)
      .reverse()
      .find((el) => {
        const key = el.dataset.accordionTrigger
        return key && !$disabled.includes(key)
      })

    return last || null
  }

  const onTriggerKeyDown = (event: KeyboardEvent) => {
    const key = getTrigger(event)?.dataset.accordionTrigger || ''

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle(key)
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      collapse(key)
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      getPrevEnabledTrigger(key)?.focus()
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      getNextEnabledTrigger(key)?.focus()
    }

    if (event.key === 'Home') {
      event.preventDefault()
      getFirstEnabledTrigger()?.focus()
    }

    if (event.key === 'End') {
      event.preventDefault()
      getLastEnabledTrigger()?.focus()
    }
  }

  // TODO: Unsubscribe
  // When multiple is set to false, only one panel can be expanded at a time.
  multiple$.subscribe((multiple) => {
    if (!multiple) {
      expanded$.update((expanded) => expanded.slice(0, 1))
    }
  })

  return {
    multiple: multiple$,
    expanded: readonly(expanded$),
    disabled: disabled$,
    triggerProps,
    contentProps,
    useAccordion,
    expand,
    collapse,
    toggle,
    expandAll,
    collapseAll,
  }
}

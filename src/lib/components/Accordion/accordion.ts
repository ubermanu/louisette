import type { DelegateEvent } from '$lib/helpers/events.js'
import { delegateEventListeners } from '$lib/helpers/events.js'
import { traveller } from '$lib/helpers/traveller.js'
import { generateId } from '$lib/helpers/uuid.js'
import type { Action } from 'svelte/action'
import { derived, get, readonly, writable } from 'svelte/store'
import type { Accordion, AccordionConfig } from './accordion.types.js'

export const createAccordion = (config?: AccordionConfig): Accordion => {
  const { multiple, expanded, disabled } = { ...config }

  const multiple$ = writable(multiple || false)
  const expanded$ = writable(expanded || [])
  const disabled$ = writable(disabled || [])

  const baseId = generateId()
  const getTriggerId = (key: string) => `${baseId}-trigger-${key}`
  const getContentId = (key: string) => `${baseId}-content-${key}`

  const triggerAttrs = derived(
    [expanded$, disabled$],
    ([expanded, disabled]) => {
      return (key: string) => ({
        id: getTriggerId(key),
        role: 'button',
        'aria-controls': getContentId(key),
        'aria-expanded': expanded.includes(key),
        'aria-disabled': disabled.includes(key),
        tabIndex: disabled.includes(key) ? -1 : 0,
        inert: disabled.includes(key) ? '' : undefined,
        'data-accordion-trigger': key,
      })
    }
  )

  const contentAttrs = derived([expanded$], ([expanded]) => {
    return (key: string) => ({
      id: getContentId(key),
      role: 'region',
      'aria-labelledby': getTriggerId(key),
      'aria-hidden': !expanded.includes(key),
      inert: !expanded.includes(key) ? '' : undefined,
      'data-accordion-content': key,
    })
  })

  /** Expands the accordion item. */
  const expand = (key: string) => {
    if (!key || get(disabled$).includes(key)) return
    expanded$.update((expanded) => {
      if (expanded.includes(key)) return expanded
      return multiple ? [...expanded, key] : [key]
    })
  }

  /** Collapses the accordion item. */
  const collapse = (key: string) => {
    if (!key || get(disabled$).includes(key)) return
    expanded$.update((expanded) => {
      if (!expanded.includes(key)) return expanded
      return expanded.filter((e) => e !== key)
    })
  }

  /** Toggles the accordion item when the trigger is clicked. */
  const toggle = (key: string) => {
    if (!key || get(disabled$).includes(key)) return
    expanded$.update((expanded) => {
      if (expanded.includes(key)) {
        return expanded.filter((e) => e !== key)
      }
      return multiple ? [...expanded, key] : [key]
    })
  }

  /** Expands all accordion items. */
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

  /** Collapses all accordion items. */
  const collapseAll = () => {
    expanded$.set([])
  }

  /** Disables the accordion item. */
  const disable = (key: string) => {
    disabled$.update((disabled) => {
      if (disabled.includes(key)) return disabled
      return [...disabled, key]
    })
  }

  /** Enables the accordion item. */
  const enable = (key: string) => {
    disabled$.update((disabled) => {
      if (!disabled.includes(key)) return disabled
      return disabled.filter((e) => e !== key)
    })
  }

  let rootNode: HTMLElement | null = null

  /** Toggles the accordion when the trigger is clicked. */
  const onTriggerClick = (event: DelegateEvent<MouseEvent>) => {
    event.preventDefault()
    toggle(event.delegateTarget.dataset.accordionTrigger as string)
  }

  /**
   * Handles keyboard navigation.
   *
   * - Enter or Space: Toggle the accordion
   * - Escape: Collapse the accordion
   * - ArrowUp: Focus the previous accordion trigger
   * - ArrowDown: Focus the next accordion trigger
   * - Home: Focus the first accordion trigger
   * - End: Focus the last accordion trigger
   */
  const onTriggerKeyDown = (event: DelegateEvent<KeyboardEvent>) => {
    const target = event.delegateTarget
    const key = target.dataset.accordionTrigger as string

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle(key)
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      collapse(key)
    }

    if (!rootNode) {
      console.warn('The accordion root node is not defined.')
      return
    }

    const $disabled = get(disabled$)

    const nodes = traveller(rootNode, '[data-accordion-trigger]', (el) => {
      return $disabled.includes(el.dataset.accordionTrigger as string)
    })

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      nodes.previous(target)?.focus()
    }

    if (event.key === 'ArrowDown') {
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

  /** Bind event listeners to the accordion */
  const useAccordion: Action = (node) => {
    rootNode = node

    const removeListeners = delegateEventListeners(node, {
      keydown: {
        '[data-accordion-trigger]': onTriggerKeyDown,
      },
      click: {
        '[data-accordion-trigger]': onTriggerClick,
      },
    })

    // When multiple is set to false, only one panel can be expanded at a time.
    const unsubscribe = multiple$.subscribe((multiple) => {
      if (!multiple) {
        expanded$.update((expanded) => expanded.slice(0, 1))
      }
    })

    return {
      destroy() {
        removeListeners()
        unsubscribe()
      },
    }
  }

  return {
    multiple: multiple$,
    expanded: readonly(expanded$),
    disabled: readonly(disabled$),
    triggerAttrs,
    contentAttrs,
    accordion: useAccordion,
    expand,
    collapse,
    toggle,
    expandAll,
    collapseAll,
    disable,
    enable,
  }
}

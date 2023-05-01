import { generateId } from '$lib/helpers.js'
import type { Action } from 'svelte/action'
import { derived, get, writable } from 'svelte/store'

type AccordionConfig = {
  multiple?: boolean
}

type Trigger = {
  id: string
  key: string
  element?: HTMLElement
}

type Content = {
  id: string
  key: string
  element?: HTMLElement
}

type TriggerAttrs = {
  key: string
  expanded?: boolean
  disabled?: boolean
}

type ContentAttrs = {
  key: string
}

export const createAccordionProvider = (config: AccordionConfig) => {
  const multiple = writable(config?.multiple || false)

  const triggers = writable<Trigger[]>([])
  const contents = writable<Content[]>([])

  const expanded = writable<string[]>([])
  const disabled = writable<string[]>([])

  const keys = derived([triggers, contents], ([$triggers, $contents]) => {
    return [...$triggers, ...$contents].map(($item) => $item.key)
  })

  const state = derived(
    [multiple, expanded, disabled, triggers, contents],
    ([$multiple, $expanded, $disabled, $triggers, $contents]) => {
      return {
        multiple: $multiple,
        expanded: $expanded,
        disabled: $disabled,
        triggers: $triggers,
        contents: $contents,
      }
    }
  )

  /** Open an item by key */
  const openItem = (key: string) => {
    if (get(disabled).includes(key)) return
    const $multiple = get(multiple)
    expanded.set($multiple ? [...get(expanded), key] : [key])
  }

  /** Close an item by key */
  const closeItem = (key: string) => {
    if (get(disabled).includes(key)) return
    expanded.update(($expanded) => $expanded.filter(($key) => $key !== key))
  }

  /** Toggle an item by key */
  const toggleItem = (key: string) => {
    if (get(disabled).includes(key)) return
    const $multiple = get(multiple)
    expanded.update(($expanded) => {
      if ($multiple) {
        return $expanded.includes(key)
          ? $expanded.filter(($key) => $key !== key)
          : [...$expanded, key]
      } else {
        return $expanded.includes(key) ? [] : [key]
      }
    })
  }

  /** Open all items */
  const openAll = () => {}

  /** Close all items */
  const closeAll = () => {
    expanded.set([])
  }

  /** TODO: Optimize this */
  const getPrevEnabledTrigger = (id: string): Trigger | null => {
    const $triggers = get(triggers)
    const index = $triggers.findIndex(($trigger) => $trigger.id === id)
    const prevTrigger = $triggers[index - 1]
    if (!prevTrigger) return null
    if (get(disabled).includes(prevTrigger.key)) {
      return getPrevEnabledTrigger(prevTrigger.id)
    }
    return prevTrigger
  }

  /** TODO: Optimize this */
  const getNextEnabledTrigger = (id: string): Trigger | null => {
    const $triggers = get(triggers)
    const index = $triggers.findIndex(($trigger) => $trigger.id === id)
    const nextTrigger = $triggers[index + 1]
    if (!nextTrigger) return null
    if (get(disabled).includes(nextTrigger.key)) {
      return getNextEnabledTrigger(nextTrigger.id)
    }
    return nextTrigger
  }

  /** TODO: Optimize this */
  const getFirstEnabledTrigger = () => {
    const $triggers = get(triggers)
    const firstTrigger = $triggers[0]
    if (!firstTrigger) return null
    if (get(disabled).includes(firstTrigger.key)) {
      return getNextEnabledTrigger(firstTrigger.id)
    }
    return firstTrigger
  }

  /** TODO: Optimize this */
  const getLastEnabledTrigger = () => {
    const $triggers = get(triggers)
    const lastTrigger = $triggers[$triggers.length - 1]
    if (!lastTrigger) return null
    if (get(disabled).includes(lastTrigger.key)) {
      return getPrevEnabledTrigger(lastTrigger.id)
    }
    return lastTrigger
  }

  /**
   * This action is responsible for registering the trigger element and handling
   * events and state changes.
   *
   * The `key` is a unique identifier for the item.
   */
  const triggerRef: Action = (node, attrs?: TriggerAttrs) => {
    const triggerId = generateId()

    if (!attrs || !attrs.key) {
      throw new Error(
        'The `key` attribute is required for an accordion item trigger.'
      )
    }

    const { key } = attrs

    // Register the trigger
    triggers.update(($triggers) => [
      ...$triggers,
      { id: triggerId, element: node, key },
    ])

    // If the trigger is disabled, add it to the disabled list
    if (attrs.disabled) {
      disabled.update(($disabled) => [...$disabled, key])
    }

    // If the trigger is already expanded, open the content
    if (attrs.expanded) {
      openItem(key)
    }

    function onClick() {
      toggleItem(key)
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        toggleItem(key)
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        closeItem(key)
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        getPrevEnabledTrigger(triggerId)?.element?.focus()
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        getNextEnabledTrigger(triggerId)?.element?.focus()
      }

      if (event.key === 'Home') {
        event.preventDefault()
        getFirstEnabledTrigger()?.element?.focus()
      }

      if (event.key === 'End') {
        event.preventDefault()
        getLastEnabledTrigger()?.element?.focus()
      }
    }

    node.addEventListener('click', onClick)
    node.addEventListener('keydown', onKeyDown)

    node.setAttribute('id', triggerId)
    node.setAttribute('role', 'button')

    const unsubscribe = state.subscribe(($state) => {
      const expanded = $state.expanded.includes(key)
      const disabled = $state.disabled.includes(key)
      node.setAttribute('aria-expanded', `${expanded}`)
      node.setAttribute('aria-disabled', `${disabled}`)
      node.setAttribute('tabindex', `${disabled ? '-1' : '0'}`)

      const content = $state.contents.find(($content) => $content.key === key)
      node.setAttribute('aria-controls', content?.id ?? '')
    })

    return {
      destroy() {
        // Remove the trigger
        triggers.update(($triggers) => {
          return $triggers.filter(($trigger) => $trigger.id !== triggerId)
        })
        node.removeEventListener('click', onClick)
        node.removeEventListener('keydown', onKeyDown)
        unsubscribe()
      },
    }
  }

  /**
   * This action is responsible for registering the content element and handling
   * events and state changes.
   *
   * The `key` is a unique identifier for the item.
   */
  const contentRef: Action = (node, attrs: ContentAttrs) => {
    const contentId = generateId()

    if (!attrs || !attrs.key) {
      throw new Error(
        'The `key` attribute is required for an accordion item content.'
      )
    }

    const { key } = attrs

    // Register the content
    contents.update(($contents) => [
      ...$contents,
      { id: contentId, element: node, key },
    ])

    node.setAttribute('id', contentId)
    node.setAttribute('role', 'region')

    // TODO: Use the `expanded` store to set the `aria-hidden` attribute
    const unsubscribe = state.subscribe(($state) => {
      const expanded = $state.expanded.includes(key)
      node.setAttribute('aria-hidden', `${!expanded}`)
      const trigger = $state.triggers.find(($trigger) => $trigger.key === key)
      node.setAttribute('aria-labelledby', trigger?.id ?? '')
    })

    return {
      destroy() {
        // Remove the content
        contents.update(($contents) => {
          return $contents.filter(($content) => $content.id !== contentId)
        })
        unsubscribe()
      },
    }
  }

  return {
    state,
    triggerRef,
    contentRef,
  }
}

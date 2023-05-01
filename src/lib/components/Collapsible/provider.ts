import { generateId } from '$lib/helpers.js'
import type { Action } from 'svelte/action'
import { derived, get, writable } from 'svelte/store'

export type CollapsibleConfig = {
  expanded?: boolean
  disabled?: boolean
}

export const createCollapsible = (config?: CollapsibleConfig) => {
  const expanded = writable(config?.expanded || false)
  const disabled = writable(config?.disabled || false)

  const triggerId = generateId()
  const contentId = generateId()

  const state = derived([expanded, disabled], ([$expanded, $disabled]) => ({
    expanded: $expanded,
    disabled: $disabled,
  }))

  const toggle = () => {
    if (get(disabled)) return
    expanded.update(($expanded) => !$expanded)
  }

  const open = () => {
    if (get(disabled) || get(expanded)) return
    expanded.set(true)
  }

  const close = () => {
    if (get(disabled) || !get(expanded)) return
    expanded.set(false)
  }

  const triggerRef: Action = (node) => {
    const onClick = (event: MouseEvent) => {
      event.preventDefault()
      toggle()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        toggle()
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      }
    }

    node.addEventListener('click', onClick)
    node.addEventListener('keydown', onKeyDown)

    node.setAttribute('id', triggerId)
    node.setAttribute('role', 'button')
    node.setAttribute('aria-controls', contentId)

    const unsubscribe = state.subscribe(($state) => {
      node.setAttribute('aria-expanded', $state.expanded.toString())
      node.setAttribute('aria-disabled', $state.disabled.toString())
      node.setAttribute('tabindex', $state.disabled ? '-1' : '0')
    })

    return {
      destroy() {
        node.removeEventListener('click', onClick)
        node.removeEventListener('keydown', onKeyDown)
        unsubscribe()
      },
    }
  }

  const contentRef: Action = (node) => {
    node.setAttribute('id', contentId)
    node.setAttribute('role', 'region')

    const unsubscribe = state.subscribe(($state) => {
      node.setAttribute('aria-hidden', (!$state.expanded).toString())
    })

    return {
      destroy() {
        unsubscribe()
      },
    }
  }

  return {
    state,
    triggerRef,
    contentRef,
    open,
    close,
    toggle,
  }
}

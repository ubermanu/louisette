import { uuid } from '$lib/helpers.js'
import type { Action } from 'svelte/action'
import { derived, get, writable } from 'svelte/store'

export type CollapsibleConfig = {
  expanded?: boolean
  disabled?: boolean
}

export const createCollapsibleProvider = (config: CollapsibleConfig) => {
  const expanded = writable(config?.expanded || false)
  const disabled = writable(config?.disabled || false)

  const id = uuid()

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

  const triggerAction: Action = (node) => {
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

    node.setAttribute('id', `${id}-trigger`)
    node.setAttribute('role', 'button')
    node.setAttribute('aria-controls', `${id}-content`)

    const unsubState = state.subscribe(($state) => {
      node.setAttribute('aria-expanded', $state.expanded.toString())
      node.setAttribute('aria-disabled', $state.disabled.toString())
      node.setAttribute('tabindex', $state.disabled ? '-1' : '0')
    })

    return {
      destroy() {
        node.removeEventListener('click', onClick)
        node.removeEventListener('keydown', onKeyDown)
        unsubState()
      },
    }
  }

  const contentAction: Action = (node) => {
    node.setAttribute('id', `${id}-content`)
    node.setAttribute('role', 'region')

    const unsubState = state.subscribe(($state) => {
      node.setAttribute('aria-hidden', (!$state.expanded).toString())
    })

    return {
      destroy() {
        unsubState()
      },
    }
  }

  return {
    state,
    trigger: triggerAction,
    content: contentAction,
    open,
    close,
    toggle,
  }
}

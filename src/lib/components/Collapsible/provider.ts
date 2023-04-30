import { uuid } from '$lib/helpers.js'
import type { Action } from 'svelte/action'
import { derived, get, writable } from 'svelte/store'

export type CollapsibleProvider = ReturnType<typeof createCollapsibleProvider>
export type CollapsibleProviderConfig = {
  expanded?: boolean
  disabled?: boolean
}

const defaults: CollapsibleProviderConfig = {
  expanded: false,
  disabled: false,
}

export const createCollapsibleProvider = (
  config: CollapsibleProviderConfig = defaults
) => {
  config = { ...defaults, ...config }

  const expanded = writable(config.expanded)
  const disabled = writable(config.disabled)

  const id = uuid()

  const state = derived([expanded, disabled], ([$expanded, $disabled]) => ({
    expanded: $expanded,
    disabled: $disabled,
  }))

  const triggerProps = derived(
    state,
    ($state) => ({
      id: `${id}-trigger`,
      role: 'button',
      tabindex: $state.disabled ? -1 : 0,
      'aria-controls': `${id}-content`,
      'aria-expanded': $state.expanded,
      'aria-disabled': $state.disabled,
    }),
    {
      id: `${id}-trigger`,
      role: 'button',
      tabindex: config.disabled ? -1 : 0,
      'aria-controls': `${id}-content`,
      'aria-expanded': config.expanded,
      'aria-disabled': config.disabled,
    }
  )

  const contentProps = derived(
    state,
    ($state) => ({
      id: `${id}-content`,
      'aria-hidden': !$state.expanded,
    }),
    {
      id: `${id}-content`,
      'aria-hidden': !config.expanded,
    }
  )

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

  const triggerEvents: Action = (node) => {
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

    return {
      destroy() {
        node.removeEventListener('click', onClick)
        node.removeEventListener('keydown', onKeyDown)
      },
    }
  }

  return {
    state,
    triggerEvents,
    triggerProps,
    contentProps,
    toggle, // FIXME: Keep exposed for now, but remove in favor of triggerEvents
  }
}

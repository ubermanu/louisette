import { uuid } from '$lib/helpers.js'
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

  return {
    state,
    triggerProps,
    contentProps,
    toggle,
  }
}

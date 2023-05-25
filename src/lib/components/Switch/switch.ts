import type { Action } from 'svelte/action'
import { derived, get, readonly, writable } from 'svelte/store'

export type SwitchConfig = {
  active?: boolean
  disabled?: boolean
}

export type Switch = ReturnType<typeof createSwitch>

export const createSwitch = (config?: SwitchConfig) => {
  const { active, disabled } = { ...config }

  const active$ = writable(active || false)
  const disabled$ = writable(disabled || false)

  const switchAttrs = derived([active$, disabled$], ([active, disabled]) => ({
    role: 'switch',
    'aria-checked': active,
    'aria-disabled': disabled,
    tabIndex: disabled ? -1 : 0,
  }))

  const activate = () => {
    if (get(disabled$)) return
    active$.set(true)
  }

  const deactivate = () => {
    if (get(disabled$)) return
    active$.set(false)
  }

  const toggle = () => {
    if (get(disabled$)) return
    active$.update((active) => !active)
  }

  const onSwitchClick = (event: MouseEvent) => {
    event.preventDefault()
    toggle()
  }

  const onSwitchKeyDown = (event: KeyboardEvent) => {
    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault()
      toggle()
    }
  }

  const useSwitch: Action = (node) => {
    node.addEventListener('click', onSwitchClick)
    node.addEventListener('keydown', onSwitchKeyDown)

    return {
      destroy() {
        node.removeEventListener('click', onSwitchClick)
        node.removeEventListener('keydown', onSwitchKeyDown)
      },
    }
  }

  return {
    active: readonly(active$),
    disabled: disabled$,
    switchAttrs,
    switch: useSwitch,
    activate,
    deactivate,
    toggle,
  }
}

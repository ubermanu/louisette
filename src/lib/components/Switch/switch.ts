import { onBrowserMount } from '$lib/helpers/environment.js'
import { generateId } from '$lib/helpers/uuid.js'
import { derived, get, readonly, writable } from 'svelte/store'
import type { Switch, SwitchConfig } from './switch.types.js'

export const createSwitch = (config?: SwitchConfig): Switch => {
  const { active, disabled } = { ...config }

  const active$ = writable(active || false)
  const disabled$ = writable(disabled || false)

  const baseId = generateId()

  const switchAttrs = derived([active$, disabled$], ([active, disabled]) => ({
    role: 'switch',
    'aria-checked': active,
    'aria-disabled': disabled,
    tabIndex: disabled ? -1 : 0,
    'data-switch': baseId,
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

  onBrowserMount(() => {
    const node = document.querySelector(`[data-switch="${baseId}"]`) as HTMLElement | null

    if (!node) {
      throw new Error('Could not find the switch')
    }

    node.addEventListener('click', onSwitchClick)
    node.addEventListener('keydown', onSwitchKeyDown)

    return () => {
      node.removeEventListener('click', onSwitchClick)
      node.removeEventListener('keydown', onSwitchKeyDown)
    }
  })

  return {
    active: readonly(active$),
    disabled: disabled$,
    switchAttrs,
    activate,
    deactivate,
    toggle,
  }
}

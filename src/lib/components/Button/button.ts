import type { Action } from 'svelte/action'
import { derived, get, writable } from 'svelte/store'
import type { Button, ButtonConfig } from './button.types.js'

export const createButton = (config?: ButtonConfig): Button => {
  const { disabled } = { ...config }

  const disabled$ = writable(disabled || false)

  const buttonAttrs = derived([disabled$], ([disabled]) => ({
    role: 'button',
    'aria-disabled': disabled,
    tabIndex: disabled ? -1 : 0,
  }))

  const onButtonClick = (event: MouseEvent) => {
    if (get(disabled$)) {
      event.preventDefault()
      return
    }
  }

  const onButtonKeyDown = (event: KeyboardEvent) => {
    if (['Enter', ' '].includes(event.key) && get(disabled$)) {
      event.preventDefault()
      return
    }
  }

  const useButton: Action = (node) => {
    node.addEventListener('click', onButtonClick)
    node.addEventListener('keydown', onButtonKeyDown)

    return {
      destroy() {
        node.removeEventListener('click', onButtonClick)
        node.removeEventListener('keydown', onButtonKeyDown)
      },
    }
  }

  return {
    disabled: disabled$,
    buttonAttrs,
    button: useButton,
  }
}

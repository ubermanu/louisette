import type { Action } from 'svelte/action'
import { derived, get, writable } from 'svelte/store'

export type ButtonConfig = {
  disabled?: boolean
  onPressStart?: (e: Event & { pointerType: string }) => void
  onPressEnd?: (e: Event & { pointerType: string }) => void
}

export const createButton = (config: ButtonConfig) => {
  const { disabled, onPressStart, onPressEnd } = {
    disabled: false,
    ...config,
  }

  const disabled$ = writable(disabled || false)

  const buttonProps = derived([disabled$], ([disabled]) => ({
    role: 'button',
    'aria-disabled': disabled,
    tabIndex: disabled ? -1 : 0,
  }))

  const controlKeys = new Set(['Enter', ' '])

  const onButtonKeyDown = (event: KeyboardEvent) => {
    if (controlKeys.has(event.key)) {
      event.preventDefault()
      if (get(disabled$)) return
      onPressStart?.({ ...event, pointerType: 'keyboard' })
    }
  }

  const onButtonKeyUp = (event: KeyboardEvent) => {
    if (controlKeys.has(event.key)) {
      event.preventDefault()
      if (get(disabled$)) return
      onPressEnd?.({ ...event, pointerType: 'keyboard' })
    }
  }

  const onButtonMouseDown = (event: MouseEvent) => {
    if (event.button !== 0) return
    if (get(disabled$)) return
    onPressStart?.({ ...event, pointerType: 'mouse' })
  }

  const onButtonMouseUp = (event: MouseEvent) => {
    if (event.button !== 0) return
    if (get(disabled$)) return
    onPressEnd?.({ ...event, pointerType: 'mouse' })
  }

  const useButton: Action = (node) => {
    node.addEventListener('keydown', onButtonKeyDown)
    node.addEventListener('keyup', onButtonKeyUp)
    node.addEventListener('mousedown', onButtonMouseDown)
    node.addEventListener('mouseup', onButtonMouseUp)

    return {
      destroy() {
        node.removeEventListener('keydown', onButtonKeyDown)
        node.removeEventListener('keyup', onButtonKeyUp)
        node.removeEventListener('mousedown', onButtonMouseDown)
        node.removeEventListener('mouseup', onButtonMouseUp)
      },
    }
  }

  return {
    disabled: disabled$,
    buttonProps,
    useButton,
  }
}

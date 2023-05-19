import type { Action } from 'svelte/action'
import { get, readonly, writable } from 'svelte/store'

export type PressEvent = { pointerType: 'mouse' | 'keyboard' }

export type PressConfig = {
  onPressStart?: (event: PressEvent) => void
  onPressEnd?: (event: PressEvent) => void
  onPressChange?: (event: PressEvent) => void
  onPressUp?: (event: PressEvent) => void
}

const controlKeys = new Set(['Enter', ' '])

export const usePress = (config?: PressConfig) => {
  const { onPressStart, onPressEnd, onPressChange, onPressUp } = {
    ...config,
  }

  const pressed$ = writable(false)

  const onButtonKeyDown = (event: KeyboardEvent) => {
    if (!controlKeys.has(event.key) || get(pressed$)) return
    event.preventDefault()
    pressed$.set(true)
    onPressChange?.({ pointerType: 'keyboard' })
    onPressStart?.({ pointerType: 'keyboard' })
  }

  const onButtonKeyUp = (event: KeyboardEvent) => {
    if (!controlKeys.has(event.key) || !get(pressed$)) return
    event.preventDefault()
    pressed$.set(false)
    onPressChange?.({ pointerType: 'keyboard' })
    onPressEnd?.({ pointerType: 'keyboard' })
    onPressUp?.({ pointerType: 'keyboard' })
  }

  const onButtonMouseDown = (event: MouseEvent) => {
    if (event.button !== 0 || get(pressed$)) return
    pressed$.set(true)
    onPressChange?.({ pointerType: 'mouse' })
    onPressStart?.({ pointerType: 'mouse' })
  }

  const onButtonMouseUp = (event: MouseEvent) => {
    if (event.button !== 0 || !get(pressed$)) return
    onPressUp?.({ pointerType: 'mouse' })
  }

  const onDocumentMouseUp = (event: MouseEvent) => {
    if (event.button !== 0 || !get(pressed$)) return
    pressed$.set(false)
    onPressChange?.({ pointerType: 'mouse' })
    onPressEnd?.({ pointerType: 'mouse' })
  }

  const onButtonMouseLeave = (event: MouseEvent) => {
    if (event.button !== 0 || !get(pressed$)) return
    pressed$.set(false)
    onPressChange?.({ pointerType: 'mouse' })
    onPressEnd?.({ pointerType: 'mouse' })
  }

  const pressEvents: Action = (node) => {
    if (onPressStart || onPressChange) {
      node.addEventListener('keydown', onButtonKeyDown)
      node.addEventListener('mousedown', onButtonMouseDown)
    }

    if (onPressEnd || onPressChange) {
      node.addEventListener('keyup', onButtonKeyUp)
      node.addEventListener('mouseleave', onButtonMouseLeave)
      document.addEventListener('mouseup', onDocumentMouseUp)
    }

    if (onPressUp) {
      node.addEventListener('mouseup', onButtonMouseUp)
    }

    return {
      destroy() {
        node.removeEventListener('keydown', onButtonKeyDown)
        node.removeEventListener('keyup', onButtonKeyUp)
        node.removeEventListener('mousedown', onButtonMouseDown)
        node.removeEventListener('mouseup', onButtonMouseUp)
        node.removeEventListener('mouseleave', onButtonMouseLeave)
        document.removeEventListener('mouseup', onDocumentMouseUp)
      },
    }
  }

  return {
    pressed: readonly(pressed$),
    pressEvents,
  }
}

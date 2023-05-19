import type { Action } from 'svelte/action'
import { get, readonly, writable } from 'svelte/store'

// TODO: Add support for touch events.
export type PointerType = 'mouse' | 'keyboard'

export type PressEvent = {
  type: 'pressstart' | 'pressend' | 'pressup' | 'press'
  pointerType: PointerType
  target: EventTarget | null
  shiftKey: boolean
  ctrlKey: boolean
  altKey: boolean
  metaKey: boolean
}

export type PressConfig = {
  /** Handler that is called when the press is released over the target. */
  onPress?: (event: PressEvent) => void

  /** Handler that is called when a press interaction starts. */
  onPressStart?: (event: PressEvent) => void

  /**
   * Handler that is called when a press interaction ends, either over the
   * target or when the pointer leaves the target.
   */
  onPressEnd?: (event: PressEvent) => void

  /**
   * Handler that is called when a press is released over the target, regardless
   * of whether it started on the target or not.
   */
  onPressUp?: (event: PressEvent) => void

  /** Handler that is called when the press state changes. */
  onPressChange?: (pressed: boolean) => void
}

const controlKeys = new Set(['Enter', ' '])

/** Creates a press event from a mouse or keyboard event. */
const createEvent = (
  event: MouseEvent | KeyboardEvent,
  type: PressEvent['type'],
  pointerType: PointerType
): PressEvent => ({
  type,
  pointerType,
  target: event.target,
  shiftKey: event.shiftKey,
  ctrlKey: event.ctrlKey,
  altKey: event.altKey,
  metaKey: event.metaKey,
})

export const usePress = (config?: PressConfig) => {
  const { onPress, onPressStart, onPressEnd, onPressChange, onPressUp } = {
    ...config,
  }

  const pressed$ = writable(false)

  const onButtonKeyDown = (event: KeyboardEvent) => {
    if (!controlKeys.has(event.key) || get(pressed$)) return
    event.preventDefault()
    pressed$.set(true)
    onPressStart?.(createEvent(event, 'pressstart', 'keyboard'))
  }

  const onButtonKeyUp = (event: KeyboardEvent) => {
    if (!controlKeys.has(event.key) || !get(pressed$)) return
    event.preventDefault()
    pressed$.set(false)
    onPress?.(createEvent(event, 'press', 'keyboard'))
    onPressEnd?.(createEvent(event, 'pressend', 'keyboard'))
    onPressUp?.(createEvent(event, 'pressup', 'keyboard'))
  }

  const onButtonMouseDown = (event: MouseEvent) => {
    if (event.button !== 0 || get(pressed$)) return
    pressed$.set(true)
    onPressStart?.(createEvent(event, 'pressstart', 'mouse'))
  }

  const onButtonMouseUp = (event: MouseEvent) => {
    if (event.button !== 0) return
    if (get(pressed$)) {
      onPress?.(createEvent(event, 'press', 'mouse'))
    }
    onPressUp?.(createEvent(event, 'pressup', 'mouse'))
  }

  const onDocumentMouseUp = (event: MouseEvent) => {
    if (event.button !== 0 || !get(pressed$)) return
    pressed$.set(false)
    onPressEnd?.(createEvent(event, 'pressend', 'mouse'))
  }

  const onButtonMouseLeave = (event: MouseEvent) => {
    if (event.button !== 0 || !get(pressed$)) return
    pressed$.set(false)
    onPressEnd?.(createEvent(event, 'pressend', 'mouse'))
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

  pressed$.subscribe((pressed) => {
    onPressChange?.(pressed)
  })

  return {
    pressed: readonly(pressed$),
    pressEvents,
  }
}

import type { Action } from 'svelte/action'
import { get, readonly, writable } from 'svelte/store'

export type PressEvent = {
  type: 'pressstart' | 'pressend' | 'pressup' | 'press'
  pointerType: 'mouse' | 'keyboard' | 'touch' | 'pen' | string
  target: EventTarget | null
  shiftKey: boolean
  ctrlKey: boolean
  altKey: boolean
  metaKey: boolean
}

export type PressConfig = {
  /** Handler that is called when the press is released over the target. */
  onPress?: (event?: PressEvent) => void

  /** Handler that is called when a press interaction starts. */
  onPressStart?: (event?: PressEvent) => void

  /**
   * Handler that is called when a press interaction ends, either over the
   * target or when the pointer leaves the target.
   */
  onPressEnd?: (event?: PressEvent) => void

  /**
   * Handler that is called when a press is released over the target, regardless
   * of whether it started on the target or not.
   */
  onPressUp?: (event?: PressEvent) => void
}

const controlKeys = new Set(['Enter', ' '])

/** Creates a press event from a mouse or keyboard event. */
const createEvent = (
  event: MouseEvent | KeyboardEvent,
  type: PressEvent['type'],
  pointerType: PressEvent['pointerType']
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
  const { onPress, onPressStart, onPressEnd, onPressUp } = {
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

  const onButtonPointerDown = (event: PointerEvent) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return
    if (get(pressed$)) return
    pressed$.set(true)
    onPressStart?.(createEvent(event, 'pressstart', event.pointerType))
  }

  const onButtonPointerUp = (event: PointerEvent) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return
    if (get(pressed$)) {
      onPress?.(createEvent(event, 'press', event.pointerType))
    }
    onPressUp?.(createEvent(event, 'pressup', event.pointerType))
  }

  const onDocumentPointerUp = (event: PointerEvent) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return
    if (!get(pressed$)) return
    pressed$.set(false)
    onPressEnd?.(createEvent(event, 'pressend', 'mouse'))
  }

  const onButtonPointerLeave = (event: PointerEvent) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return
    if (!get(pressed$)) return
    pressed$.set(false)
    onPressEnd?.(createEvent(event, 'pressend', 'mouse'))
  }

  const pressEvents: Action = (node) => {
    node.addEventListener('keydown', onButtonKeyDown)
    node.addEventListener('pointerdown', onButtonPointerDown)
    node.addEventListener('keyup', onButtonKeyUp)
    node.addEventListener('pointerup', onButtonPointerUp)
    node.addEventListener('pointerleave', onButtonPointerLeave)
    document.addEventListener('pointerup', onDocumentPointerUp)

    return {
      destroy() {
        node.removeEventListener('keydown', onButtonKeyDown)
        node.removeEventListener('keyup', onButtonKeyUp)
        node.removeEventListener('pointerdown', onButtonPointerDown)
        node.removeEventListener('pointerup', onButtonPointerUp)
        node.removeEventListener('pointerleave', onButtonPointerLeave)
        document.removeEventListener('pointerup', onDocumentPointerUp)
      },
    }
  }

  return {
    pressed: readonly(pressed$),
    pressEvents,
  }
}

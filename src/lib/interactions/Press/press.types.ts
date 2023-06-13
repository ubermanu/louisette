import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type PressEvent = {
  type: 'pressstart' | 'pressend' | 'pressup' | 'press' | string
  pointerType: 'mouse' | 'keyboard' | 'touch' | 'pen' | string
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
}

export type Press = {
  /** Whether the element is currently pressed. */
  pressed: Readable<boolean>

  /** The action to bind to the HTML element. */
  press: Action
}

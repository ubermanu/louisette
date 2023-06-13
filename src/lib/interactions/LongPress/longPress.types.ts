import type { PressEvent } from '$lib/index.js'
import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type LongPressEvent = PressEvent & {
  type: 'longpressstart' | 'longpressend' | 'longpress'
}

export type LongPressConfig = {
  /**
   * The number of milliseconds to wait before triggering the long press.
   *
   * @default 1000
   */
  threshold?: number

  /**
   * Handler that is called when the threshold time is met while the press is
   * over the target.
   */
  onLongPress?: (event: LongPressEvent) => void

  /** Handler that is called when a long press interaction starts. */
  onLongPressStart?: (event: LongPressEvent) => void

  /**
   * Handler that is called when a long press interaction ends, either over the
   * target or when the pointer leaves the target.
   */
  onLongPressEnd?: (event?: LongPressEvent) => void
}

export type LongPress = {
  pressed: Readable<boolean>
  longPress: Action
}

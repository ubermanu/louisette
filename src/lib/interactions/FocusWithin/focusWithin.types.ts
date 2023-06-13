import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type FocusWithinConfig = {
  /**
   * Handler that is called when the element or any of its children receive
   * focus.
   */
  onFocusWithin?: () => void

  /** Handler that is called when the element or any of its children loose focus. */
  onBlurWithin?: () => void
}

export type FocusWithin = {
  /** Whether the element or any of its children currently has focus. */
  focused: Readable<boolean>

  /** The action to bind to the HTML element. */
  focusWithin: Action
}

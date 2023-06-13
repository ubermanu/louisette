import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type FocusVisible = {
  /** Whether the element is currently focused by a keyboard. */
  focused: Readable<boolean>

  /** The action to bind to the HTML element. */
  focusVisible: Action
}

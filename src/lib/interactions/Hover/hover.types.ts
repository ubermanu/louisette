import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type HoverEvent = {
  type: 'hoverstart' | 'hoverend'
  pointerType: PointerEvent['pointerType']
  target: EventTarget | null
}

export type HoverConfig = {
  /** Handler that is called when the pointer hovers over the target. */
  onHoverStart?: (event?: HoverEvent) => void

  /** Handler that is called when the pointer leaves the target. */
  onHoverEnd?: (event?: HoverEvent) => void
}

export type Hover = {
  /** Whether the pointer is currently hovering over the target. */
  hovering: Readable<boolean>

  /** The action to bind to the HTML element. */
  hover: Action
}

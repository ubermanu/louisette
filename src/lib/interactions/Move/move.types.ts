import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type MoveEvent = {
  type: 'movestart' | 'moveend' | 'move'
  deltaX: number
  deltaY: number
  pointerType: 'mouse' | 'pen' | 'touch' | 'keyboard' | 'virtual'
  shiftKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  altKey: boolean
}

export type MoveConfig = {
  /** Handler that is called when the element is starting to move. */
  onMoveStart?: (event: MoveEvent) => void

  /** Handler that is called when the element is no longer moving. */
  onMoveEnd?: (event: MoveEvent) => void

  /** Handler that is called when the element is moving. */
  onMove?: (event: MoveEvent) => void
}

export type Move = {
  /** Whether the element is currently moving. */
  moving: Readable<boolean>

  /** The action to bind to the HTML element. */
  move: Action
}

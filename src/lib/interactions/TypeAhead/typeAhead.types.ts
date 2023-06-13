import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type TypeAheadConfig = {
  /** The time in milliseconds to wait before ending the typeahead. */
  threshold?: number

  /** The callback when a new character is pushed. */
  onTypeAhead?: (value: string) => void

  /** The callback when the typeahead starts. */
  onTypeAheadStart?: () => void

  /** The callback when the typeahead ends. */
  onTypeAheadEnd?: () => void
}

export type TypeAhead = {
  /** The characters currently typed. */
  typing: Readable<string>

  /** The action to bind to the HTML element. */
  typeAhead: Action

  /** Stops the typeahead. */
  stop: () => void
}

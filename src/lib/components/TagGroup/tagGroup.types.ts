import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Readable } from 'svelte/store'

export type TagGroupConfig = {
  /** An array of tags that should be disabled. */
  disabled?: string[]

  /** A callback that is called when a tag is dismissed. */
  onDismiss?: (tag: string) => void
}

export type TagGroup = {
  tagGroupAttrs: Readable<HTMLAttributes>
  tagAttrs: Readable<(tag: string) => HTMLAttributes>
  dismissButtonAttrs: Readable<(tag: string) => HTMLAttributes>
  dismiss: (tag: string) => void
}

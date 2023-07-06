import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Readable, Writable } from 'svelte/store'

export type CollapsibleConfig = {
  expanded?: boolean
  disabled?: boolean
}

export type Collapsible = {
  expanded: Readable<boolean>
  disabled: Writable<boolean>
  triggerAttrs: Readable<HTMLAttributes>
  contentAttrs: Readable<HTMLAttributes>
  expand: () => void
  toggle: () => void
  collapse: () => void
}

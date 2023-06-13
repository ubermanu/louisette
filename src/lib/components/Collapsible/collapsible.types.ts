import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type CollapsibleConfig = {
  expanded?: boolean
  disabled?: boolean
}

export type Collapsible = {
  expanded: Readable<boolean>
  disabled: Readable<boolean>
  triggerAttrs: Readable<HTMLAttributes>
  contentAttrs: Readable<HTMLAttributes>
  trigger: Action
  expand: () => void
  toggle: () => void
  collapse: () => void
}

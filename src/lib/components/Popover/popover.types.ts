import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type Popover = {
  visible: Readable<boolean>
  triggerAttrs: Readable<HTMLAttributes>
  popoverAttrs: Readable<HTMLAttributes>
  trigger: Action
  popover: Action
  show: () => void
  hide: () => void
  toggle: () => void
}

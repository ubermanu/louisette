import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Readable } from 'svelte/store'

export type Popover = {
  visible: Readable<boolean>
  triggerAttrs: Readable<HTMLAttributes>
  popoverAttrs: Readable<HTMLAttributes>
  show: () => void
  hide: () => void
  toggle: () => void
}

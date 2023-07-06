import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Middleware, Placement } from '@floating-ui/dom'
import type { Readable } from 'svelte/store'

export type PopoverConfig = {
  placement?: Placement
  middleware?: Array<Middleware | null | undefined | false>
}

export type Popover = {
  visible: Readable<boolean>
  position: Readable<{ x: number; y: number }>
  triggerAttrs: Readable<HTMLAttributes>
  popoverAttrs: Readable<HTMLAttributes>
  show: () => void
  hide: () => void
  toggle: () => void
}

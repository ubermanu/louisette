import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Readable } from 'svelte/store'
import type { Placement, Middleware } from '@floating-ui/dom'

export type TooltipConfig = {
  placement?: Placement
  middleware?: Array<Middleware | null | undefined | false>
}

export type Tooltip = {
  visible: Readable<boolean>
  position: Readable<{ x: number, y: number }>
  tooltipAttrs: Readable<HTMLAttributes>
  triggerAttrs: Readable<HTMLAttributes>
  show: () => void
  hide: () => void
}

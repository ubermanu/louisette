import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Readable } from 'svelte/store'

export type Tooltip = {
  visible: Readable<boolean>
  tooltipAttrs: Readable<HTMLAttributes>
  triggerAttrs: Readable<HTMLAttributes>
  show: () => void
  hide: () => void
}

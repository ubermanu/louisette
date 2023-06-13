import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type Tooltip = {
  visible: Readable<boolean>
  tooltipAttrs: Readable<HTMLAttributes>
  triggerAttrs: Readable<HTMLAttributes>
  trigger: Action
  show: () => void
  hide: () => void
}

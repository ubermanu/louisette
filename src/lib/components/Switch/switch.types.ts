import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Readable } from 'svelte/store'

export type SwitchConfig = {
  active?: boolean
  disabled?: boolean
}

export type Switch = {
  active: Readable<boolean>
  disabled: Readable<boolean>
  switchAttrs: Readable<HTMLAttributes>
  activate: () => void
  deactivate: () => void
  toggle: () => void
}

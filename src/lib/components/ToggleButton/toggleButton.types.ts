import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Readable, Writable } from 'svelte/store'

export type ToggleButtonConfig = {
  checked?: boolean
  disabled?: boolean
}

export type ToggleButton = {
  checked: Readable<boolean>
  disabled: Writable<boolean>
  toggleButtonAttrs: Readable<HTMLAttributes>
  check: () => void
  uncheck: () => void
  toggle: () => void
}

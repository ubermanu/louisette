import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { ButtonConfig } from '$lib/index.js'
import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type ToggleButtonConfig = ButtonConfig & {
  checked?: boolean
}

export type ToggleButton = {
  checked: Readable<boolean>
  disabled: Readable<boolean>
  toggleButtonAttrs: Readable<HTMLAttributes>
  toggleButton: Action
  check: () => void
  uncheck: () => void
  toggle: () => void
}

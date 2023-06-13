import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type SwitchConfig = {
  active?: boolean
  disabled?: boolean
}

export type Switch = {
  active: Readable<boolean>
  disabled: Readable<boolean>
  switchAttrs: Readable<HTMLAttributes>
  switch: Action
  activate: () => void
  deactivate: () => void
  toggle: () => void
}

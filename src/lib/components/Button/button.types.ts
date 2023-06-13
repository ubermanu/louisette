import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type ButtonConfig = {
  disabled?: boolean
}

export type Button = {
  disabled: Readable<boolean>
  buttonAttrs: Readable<HTMLAttributes>
  button: Action
}

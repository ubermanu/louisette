import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Readable, Writable } from 'svelte/store'

export type ButtonConfig = {
  disabled?: boolean
}

export type Button = {
  disabled: Writable<boolean>
  buttonAttrs: Readable<HTMLAttributes>
}

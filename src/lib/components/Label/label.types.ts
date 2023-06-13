import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type Label = {
  labelAttrs: Readable<HTMLAttributes>
  fieldAttrs: Readable<HTMLAttributes>
  label: Action
}

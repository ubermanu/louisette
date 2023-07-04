import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Readable } from 'svelte/store'

export type Label = {
  labelAttrs: Readable<HTMLAttributes>
  fieldAttrs: Readable<HTMLAttributes>
}

import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Readable, Writable } from 'svelte/store'

export type LinkConfig = {
  disabled?: boolean
  href: string
  target?: string
}

export type Link = {
  href: Writable<string>
  target: Writable<string>
  disabled: Writable<boolean>
  linkAttrs: Readable<HTMLAttributes>
}

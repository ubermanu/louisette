import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Readable } from 'svelte/store'

export type MenuConfig = {
  disabled?: string[]
  orientation?: 'horizontal' | 'vertical'
}

export type Menu = {
  disabled: Readable<string[]>
  orientation: Readable<'horizontal' | 'vertical'>
  activePath: Readable<string[]>
  menuAttrs: Readable<HTMLAttributes>
  itemAttrs: Readable<(key: string) => HTMLAttributes>
  triggerAttrs: Readable<(key: string) => HTMLAttributes>
  submenuAttrs: Readable<(key: string) => HTMLAttributes>
  separatorAttrs: Readable<HTMLAttributes>
}

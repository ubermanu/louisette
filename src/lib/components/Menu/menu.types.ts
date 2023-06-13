import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type MenuConfig = {
  disabled?: string[]
  orientation?: 'horizontal' | 'vertical'
}

export type Menu = {
  disabled: Readable<string[]>
  orientation: Readable<'horizontal' | 'vertical'>
  menu: Action
  menuAttrs: Readable<HTMLAttributes>
  itemAttrs: Readable<(key: string) => HTMLAttributes>
  separatorAttrs: Readable<HTMLAttributes>
}

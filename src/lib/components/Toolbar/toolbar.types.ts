import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type ToolbarConfig = {
  orientation?: 'horizontal' | 'vertical'
}

export type Toolbar = {
  orientation: Readable<'horizontal' | 'vertical'>
  toolbarAttrs: Readable<HTMLAttributes>
  itemAttrs: Readable<(key: string) => HTMLAttributes>
  toolbar: Action
}

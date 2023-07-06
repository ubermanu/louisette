import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Readable, Writable } from 'svelte/store'

export type ToolbarConfig = {
  orientation?: 'horizontal' | 'vertical'
}

export type Toolbar = {
  orientation: Writable<'horizontal' | 'vertical'>
  toolbarAttrs: Readable<HTMLAttributes>
  itemAttrs: Readable<(key: string) => HTMLAttributes>
}

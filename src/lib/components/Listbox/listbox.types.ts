import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type ListboxConfig = {
  /** The key of the selected options. */
  selected?: string[]

  /** The key of the disabled options. */
  disabled?: string[]

  /** If true, the listbox allows multiple selections. */
  multiple?: boolean

  /** The orientation of the listbox. */
  orientation?: 'horizontal' | 'vertical'
}

export type Listbox = {
  selected: Readable<string[]>
  disabled: Readable<string[]>
  listboxAttrs: Readable<HTMLAttributes>
  optionAttrs: Readable<(key: string) => HTMLAttributes>
  groupAttrs: Readable<(key: string) => HTMLAttributes>
  listbox: Action
  select: (key: string) => void
  unselect: (key: string) => void
  toggle: (key: string) => void
  selectAll: () => void
  unselectAll: () => void
}

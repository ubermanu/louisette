import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Readable, Writable } from 'svelte/store'

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
  activeDescendant: Writable<string>
  listboxAttrs: Readable<HTMLAttributes>
  optionAttrs: Readable<(key: string) => HTMLAttributes>
  groupAttrs: Readable<(key: string) => HTMLAttributes>
  select: (key: string) => void
  unselect: (key: string) => void
  toggle: (key: string) => void
  selectAll: () => void
  unselectAll: () => void
}

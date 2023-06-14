import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type SelectConfig = {
  multiple?: boolean
  disabled?: string[]
  selected?: string[]
}

export type Select = {
  opened: Readable<boolean>
  disabled: Readable<string[]>
  selected: Readable<string[]>
  selectedLabel: Readable<string>
  button: Action
  buttonAttrs: Readable<HTMLAttributes>
  listbox: Action
  listboxAttrs: Readable<HTMLAttributes>
  optionAttrs: Readable<(key: string) => HTMLAttributes>
  select: (key: string) => void
  unselect: (key: string) => void
  toggle: (key: string) => void
  selectAll: () => void
  unselectAll: () => void
}

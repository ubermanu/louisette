import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type ComboboxConfig = {
  autocomplete?: boolean
  disabled?: string[]
  selected?: string[]
}

export type Combobox = {
  opened: Readable<boolean>
  disabled: Readable<string[]>
  selected: Readable<string[]>
  activeDescendant: Readable<string>
  input: Action
  inputAttrs: Readable<HTMLAttributes>
  button: Action
  buttonAttrs: Readable<HTMLAttributes>
  listbox: Action
  listboxAttrs: Readable<HTMLAttributes>
  optionAttrs: Readable<(key: string) => HTMLAttributes>
  select: (key: string) => void
  unselect: (key: string) => void
  toggle: (key: string) => void
}

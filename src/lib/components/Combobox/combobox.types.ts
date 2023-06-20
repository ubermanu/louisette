import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type ComboboxConfig = {
  /**
   * If true, the matching option will be inserted into the input when the user
   * types. If false, the input will be left unchanged.
   *
   * @defaultValue false
   */
  autocomplete?: boolean

  /** The disabled options. */
  disabled?: string[]

  /** The selected options. */
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

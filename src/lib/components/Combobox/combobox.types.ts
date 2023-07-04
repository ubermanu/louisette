import type { HTMLAttributes } from '$lib/helpers/types.js'
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
  comboboxAttrs: Readable<HTMLAttributes>
  inputAttrs: Readable<HTMLAttributes>
  buttonAttrs: Readable<HTMLAttributes>
  listboxAttrs: Readable<HTMLAttributes>
  optionAttrs: Readable<(key: string) => HTMLAttributes>
  select: (key: string) => void
  unselect: (key: string) => void
  toggle: (key: string) => void
}

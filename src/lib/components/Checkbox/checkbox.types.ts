import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Readable } from 'svelte/store'

export type CheckboxConfig = {
  checked?: boolean
  disabled?: boolean
  indeterminate?: boolean
}

export type Checkbox = {
  checked: Readable<boolean>
  indeterminate: Readable<boolean>
  disabled: Readable<boolean>
  checkboxAttrs: Readable<HTMLAttributes>
  check: () => void
  partiallyCheck: () => void
  uncheck: () => void
  toggle: () => void
}

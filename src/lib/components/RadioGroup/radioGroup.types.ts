import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type RadioGroupConfig = {
  selected?: string
  disabled?: string[]
}

export type RadioGroup = {
  selected: Readable<string>
  disabled: Readable<string[]>
  radioGroupAttrs: Readable<Record<string, any>>
  radioAttrs: Readable<(key: string) => Record<string, any>>
  radioGroup: Action
  select: (key: string) => void
}

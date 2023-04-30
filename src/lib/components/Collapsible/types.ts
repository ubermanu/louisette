import type { Readable } from 'svelte/store'

export interface CollapsibleContext {
  id: string
  toggle: () => void
  opened: Readable<boolean>
  disabled: boolean
}

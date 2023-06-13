import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type DropConfig = {
  accept?: string[]
  onDrop?: (e: DragEvent) => void
}

export type Drop = {
  hovering: Readable<boolean>
  drop: Action
}

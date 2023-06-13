import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Action } from 'svelte/action'
import type { SvelteComponent } from 'svelte/internal'
import type { Readable } from 'svelte/store'

export type DragConfig = {
  onDragStart?: (e: DragEvent) => void
  onDragEnd?: (e: DragEvent) => void
  preview?: SvelteComponent | string
}

export type Drag = {
  dragging: Readable<boolean>
  draggableAttrs: Readable<HTMLAttributes>
  drag: Action
}

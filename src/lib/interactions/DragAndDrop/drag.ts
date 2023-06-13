import type { Action } from 'svelte/action'
import { get, readable, readonly, writable } from 'svelte/store'
import type { Drag, DragConfig } from './drag.types.js'

// TODO: Add keyboard support
// TODO: Add drag image support (rendered component)
export const useDrag = (config?: DragConfig): Drag => {
  const { onDragStart, onDragEnd } = { ...config }

  const dragging$ = writable(false)
  const data$ = writable<string>('')

  const draggableAttrs = readable({
    draggable: true,
  })

  const onDragStartHandler = async (event: DragEvent) => {
    dragging$.set(true)
    event.dataTransfer?.setData('text/plain', get(data$))
    onDragStart?.(event)
  }

  const onDragEndHandler = (event: DragEvent) => {
    dragging$.set(false)
    onDragEnd?.(event)
  }

  const drag: Action = (node, data: string = '') => {
    data$.set(data)

    node.addEventListener('dragstart', onDragStartHandler)
    node.addEventListener('dragend', onDragEndHandler)

    return {
      update(data: string) {
        data$.set(data)
      },
      destroy() {
        dragging$.set(false)
        node.removeEventListener('dragstart', onDragStartHandler)
        node.removeEventListener('dragend', onDragEndHandler)
      },
    }
  }

  return {
    dragging: readonly(dragging$),
    draggableAttrs,
    drag,
  }
}

import type { Action } from 'svelte/action'
import { readonly, writable } from 'svelte/store'

export type DropConfig = {
  accept?: string[]
  onDrop?: (e: DragEvent) => void
}

// TODO: Add keyboard support
export const useDrop = (config?: DropConfig) => {
  const { onDrop } = { ...config }

  const hovering$ = writable(false)

  const onDragOverHandler = (e: DragEvent) => {
    e.preventDefault()
    hovering$.set(true)
  }

  const onDragLeaveHandler = (e: DragEvent) => {
    e.preventDefault()
    hovering$.set(false)
  }

  const onDropHandler = (e: DragEvent) => {
    e.preventDefault()
    hovering$.set(false)
    onDrop?.(e)
  }

  const drop: Action = (node) => {
    node.addEventListener('dragover', onDragOverHandler)
    node.addEventListener('dragleave', onDragLeaveHandler)
    node.addEventListener('drop', onDropHandler)

    return {
      destroy() {
        node.removeEventListener('dragover', onDragOverHandler)
        node.removeEventListener('dragleave', onDragLeaveHandler)
        node.removeEventListener('drop', onDropHandler)
      },
    }
  }

  return {
    hovering: readonly(hovering$),
    drop,
  }
}

import type { Action } from 'svelte/action'
import { readonly, writable } from 'svelte/store'

export type MoveEvent = {
  type: 'movestart' | 'moveend' | 'move'
  deltaX: number
  deltaY: number
  pointerType: 'mouse' | 'pen' | 'touch' | 'keyboard' | 'virtual'
  shiftKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  altKey: boolean
}

export type MoveConfig = {
  onMoveStart?: (event: MoveEvent) => void
  onMoveEnd?: (event: MoveEvent) => void
  onMove?: (event: MoveEvent) => void
}

export const useMove = (config?: MoveConfig) => {
  const { onMoveStart, onMoveEnd, onMove } = { ...config }

  const moving$ = writable(false)
  let is_moving = false

  const onPointerDown = (event: PointerEvent) => {
    moving$.set((is_moving = true))
    onMoveStart?.({
      type: 'movestart',
      deltaX: 0,
      deltaY: 0,
      pointerType: event.pointerType as MoveEvent['pointerType'],
      shiftKey: event.shiftKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      altKey: event.altKey,
    })
    document.addEventListener('pointermove', onDocumentPointerMove)
    document.addEventListener('pointerup', onDocumentPointerUp)
  }

  const onDocumentPointerMove = (event: PointerEvent) => {
    if (is_moving) {
      onMove?.({
        type: 'move',
        deltaX: event.movementX,
        deltaY: event.movementY,
        pointerType: event.pointerType as MoveEvent['pointerType'],
        shiftKey: event.shiftKey,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        altKey: event.altKey,
      })
    }
  }

  const onDocumentPointerUp = (event: PointerEvent) => {
    if (is_moving) {
      moving$.set((is_moving = false))
      onMoveEnd?.({
        type: 'moveend',
        deltaX: 0,
        deltaY: 0,
        pointerType: event.pointerType as MoveEvent['pointerType'],
        shiftKey: event.shiftKey,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        altKey: event.altKey,
      })
      document.removeEventListener('pointermove', onDocumentPointerMove)
      document.removeEventListener('pointerup', onDocumentPointerUp)
    }
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const moveEvent: MoveEvent = {
      type: 'move',
      deltaX: 0,
      deltaY: 0,
      pointerType: 'keyboard',
      shiftKey: event.shiftKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      altKey: event.altKey,
    }

    if (!is_moving) {
      moving$.set((is_moving = true))
      onMoveStart?.({
        ...moveEvent,
        type: 'movestart',
      })
      document.addEventListener('keyup', onKeyUp)
    }

    onMove?.({
      ...moveEvent,
      type: 'move',
      deltaX:
        event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0,
      deltaY: event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0,
    })
  }

  const onKeyUp = (event: KeyboardEvent) => {
    if (is_moving) {
      moving$.set((is_moving = false))
      onMoveEnd?.({
        type: 'moveend',
        deltaX: 0,
        deltaY: 0,
        pointerType: 'keyboard',
        shiftKey: event.shiftKey,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        altKey: event.altKey,
      })
    }
  }

  const move: Action = (node) => {
    node.addEventListener('pointerdown', onPointerDown)
    node.addEventListener('keydown', onKeyDown)

    return {
      destroy() {
        node.removeEventListener('pointerdown', onPointerDown)
        node.removeEventListener('keydown', onKeyDown)
      },
    }
  }

  return {
    moving: readonly(moving$),
    move,
  }
}

import type { Action } from 'svelte/action'
import { readonly, writable } from 'svelte/store'

export type HoverEvent = {
  type: 'hoverstart' | 'hoverend'
  pointerType: PointerEvent['pointerType']
  target: EventTarget | null
}

export type HoverConfig = {
  onHoverStart?: (event?: HoverEvent) => void
  onHoverEnd?: (event?: HoverEvent) => void
}

const useHover = (config?: HoverConfig) => {
  const { onHoverStart, onHoverEnd } = { ...config }

  const hovering$ = writable(false)

  const onPointerEnter = (event: PointerEvent) => {
    hovering$.set(true)
    onHoverStart?.({
      type: 'hoverstart',
      pointerType: event.pointerType,
      target: event.target,
    })
  }

  const onPointerLeave = (event: PointerEvent) => {
    hovering$.set(false)
    onHoverEnd?.({
      type: 'hoverend',
      pointerType: event.pointerType,
      target: event.target,
    })
  }

  const hoverEvents: Action = (node) => {
    node.addEventListener('pointerenter', onPointerEnter)
    node.addEventListener('pointerleave', onPointerLeave)

    return {
      destroy() {
        node.removeEventListener('pointerenter', onPointerEnter)
        node.removeEventListener('pointerleave', onPointerLeave)
      },
    }
  }

  return {
    hovering: readonly(hovering$),
    hoverEvents,
  }
}

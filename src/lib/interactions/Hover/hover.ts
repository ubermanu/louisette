import type { Action } from 'svelte/action'
import { readonly, writable } from 'svelte/store'
import type { Hover, HoverConfig } from './hover.types.js'

export const useHover = (config?: HoverConfig): Hover => {
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

  const hover: Action = (node) => {
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
    hover,
  }
}

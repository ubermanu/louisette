import { onBrowserMount } from '$lib/helpers/environment.js'
import { generateId } from '$lib/helpers/uuid.js'
import { autoUpdate, computePosition } from '@floating-ui/dom'
import { derived, readable, readonly, writable } from 'svelte/store'
import type { Tooltip, TooltipConfig } from './tooltip.types.js'

export const createTooltip = (config?: TooltipConfig): Tooltip => {
  const { placement, middleware } = { ...config }

  const visible$ = writable(false)
  const position$ = writable({ x: 0, y: 0 })

  const tooltipId = generateId()

  const tooltipAttrs = derived(visible$, (visible) => ({
    id: tooltipId,
    role: 'tooltip',
    inert: !visible ? '' : undefined,
    'aria-hidden': !visible,
  }))

  const triggerAttrs = readable({
    'aria-describedby': tooltipId,
    'data-tooltip': tooltipId,
  })

  const show = () => {
    visible$.set(true)
  }

  const hide = () => {
    visible$.set(false)
  }

  const onTriggerPointerEnter = (event: PointerEvent) => {
    show()
    // @ts-ignore
    event.currentTarget?.addEventListener('pointerleave', onTriggerPointerLeave)
  }

  const onTriggerPointerLeave = (event: PointerEvent) => {
    hide()
    // @ts-ignore
    event.currentTarget?.removeEventListener('pointerleave', onTriggerPointerLeave)
  }

  const onTriggerKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      hide()
    }
  }

  const onTriggerFocus = (event: FocusEvent) => {
    show()
    // @ts-ignore
    event.currentTarget?.addEventListener('blur', onTriggerBlur)
  }

  const onTriggerBlur = (event: FocusEvent) => {
    hide()
    // @ts-ignore
    event.currentTarget?.removeEventListener('blur', onTriggerBlur)
  }

  // TODO: The tooltip should keep open when the mouse is over the tooltip
  onBrowserMount(() => {
    const node = document.querySelector<HTMLElement>(`[data-tooltip=${tooltipId}]`)

    if (!node) {
      throw new Error('Could not find the trigger for the tooltip')
    }

    const tooltip = document.getElementById(tooltipId)

    if (!tooltip) {
      throw new Error('Could not find the element for the tooltip')
    }

    node.addEventListener('pointerenter', onTriggerPointerEnter)
    node.addEventListener('keydown', onTriggerKeyDown)
    node.addEventListener('focus', onTriggerFocus)

    const updatePosition = async () => {
      const { x, y } = await computePosition(node, tooltip, {
        placement,
        middleware,
      })
      position$.set({ x, y })
    }

    const destroy = autoUpdate(node, tooltip, updatePosition)

    return () => {
      destroy()
      node.removeEventListener('pointerenter', onTriggerPointerEnter)
      node.removeEventListener('keydown', onTriggerKeyDown)
      node.removeEventListener('focus', onTriggerFocus)
    }
  })

  return {
    visible: readonly(visible$),
    position: readonly(position$),
    tooltipAttrs,
    triggerAttrs,
    show,
    hide,
  }
}

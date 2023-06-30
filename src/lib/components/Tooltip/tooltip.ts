import { onBrowserMount } from '$lib/helpers/environment.js'
import { generateId } from '$lib/helpers/uuid.js'
import { derived, readable, readonly, writable } from 'svelte/store'
import type { Tooltip } from './tooltip.types.js'

export const createTooltip = (): Tooltip => {
  const visible$ = writable(false)

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
    const node = document.querySelector(`[data-tooltip=${tooltipId}]`) as HTMLElement | null

    if (!node) {
      throw new Error('Could not find the trigger for the tooltip')
    }

    node.addEventListener('pointerenter', onTriggerPointerEnter)
    node.addEventListener('keydown', onTriggerKeyDown)
    node.addEventListener('focus', onTriggerFocus)

    return () => {
      node.removeEventListener('pointerenter', onTriggerPointerEnter)
      node.removeEventListener('keydown', onTriggerKeyDown)
      node.removeEventListener('focus', onTriggerFocus)
    }
  })

  return {
    visible: readonly(visible$),
    tooltipAttrs,
    triggerAttrs,
    show,
    hide,
  }
}

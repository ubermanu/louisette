import { generateId } from '$lib/helpers.js'
import type { Action } from 'svelte/action'
import { derived, readable, readonly, writable } from 'svelte/store'

export const createTooltip = () => {
  const tooltipId = generateId()
  const opened$ = writable(false)

  const tooltipAttrs = derived(opened$, (opened) => ({
    id: tooltipId,
    role: 'tooltip',
    inert: !opened,
    'aria-hidden': !opened ? 'true' : undefined,
  }))

  const triggerAttrs = readable({
    'aria-describedby': tooltipId,
  })

  const open = () => {
    opened$.set(true)
  }

  const close = () => {
    opened$.set(false)
  }

  const onTriggerPointerEnter = (event: PointerEvent) => {
    open()
    event.currentTarget?.addEventListener('pointerleave', onTriggerPointerLeave)
  }

  const onTriggerPointerLeave = () => {
    close()
  }

  const onTriggerKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      close()
    }
  }

  const onTriggerFocus = (event: FocusEvent) => {
    open()
    event.currentTarget?.addEventListener('blur', onTriggerBlur)
  }

  const onTriggerBlur = () => {
    close()
  }

  // TODO: The tooltip should keep open when the mouse is over the tooltip
  const useTrigger: Action = (node) => {
    node.addEventListener('pointerenter', onTriggerPointerEnter)
    node.addEventListener('keydown', onTriggerKeyDown)
    node.addEventListener('focus', onTriggerFocus)

    return {
      destroy() {
        node.removeEventListener('pointerenter', onTriggerPointerEnter)
        node.removeEventListener('keydown', onTriggerKeyDown)
        node.removeEventListener('focus', onTriggerFocus)
      },
    }
  }

  return {
    opened: readonly(opened$),
    tooltipAttrs,
    triggerAttrs,
    trigger: useTrigger,
    open,
    close,
  }
}

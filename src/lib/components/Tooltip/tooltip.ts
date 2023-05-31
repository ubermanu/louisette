import { generateId } from '$lib/helpers/uuid.js'
import type { Action } from 'svelte/action'
import { derived, readable, readonly, writable } from 'svelte/store'

export type Tooltip = ReturnType<typeof createTooltip>

export const createTooltip = () => {
  const tooltipId = generateId()
  const visible$ = writable(false)

  const tooltipAttrs = derived(visible$, (visible) => ({
    id: tooltipId,
    role: 'tooltip',
    inert: !visible ? '' : undefined,
    'aria-hidden': !visible,
  }))

  const triggerAttrs = readable({
    'aria-describedby': tooltipId,
  })

  const show = () => {
    visible$.set(true)
  }

  const hide = () => {
    visible$.set(false)
  }

  const onTriggerPointerEnter = (event: PointerEvent) => {
    show()
    event.currentTarget?.addEventListener('pointerleave', onTriggerPointerLeave)
  }

  const onTriggerPointerLeave = () => {
    hide()
  }

  const onTriggerKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      hide()
    }
  }

  const onTriggerFocus = (event: FocusEvent) => {
    show()
    event.currentTarget?.addEventListener('blur', onTriggerBlur)
  }

  const onTriggerBlur = () => {
    hide()
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
    visible: readonly(visible$),
    tooltipAttrs,
    triggerAttrs,
    trigger: useTrigger,
    show,
    hide,
  }
}

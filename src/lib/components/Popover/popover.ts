import { focusTrap } from '$lib/actions/FocusTrap/focusTrap.js'
import { onBrowserMount } from '$lib/helpers/environment.js'
import { tabbable } from '$lib/helpers/tabbable.js'
import { generateId } from '$lib/helpers/uuid.js'
import { autoUpdate, computePosition } from '@floating-ui/dom'
import { tick } from 'svelte'
import { derived, get, readonly, writable } from 'svelte/store'
import type { Popover, PopoverConfig } from './popover.types.js'

export const createPopover = (config?: PopoverConfig): Popover => {
  const { placement, middleware } = { ...config }

  const visible$ = writable(false)
  const position$ = writable({ x: 0, y: 0 })

  const baseId = generateId()
  const triggerId = `${baseId}-trigger`
  const popoverId = `${baseId}-popover`

  const triggerAttrs = derived(visible$, (visible) => ({
    id: triggerId,
    'aria-expanded': visible,
    'aria-controls': popoverId,
  }))

  const popoverAttrs = derived(visible$, (visible) => ({
    id: popoverId,
    inert: !visible ? '' : undefined,
    'aria-hidden': !visible,
    'aria-labelledby': triggerId,
  }))

  const show = () => {
    visible$.set(true)
    document.addEventListener('click', onDocumentClick, true)
    document.addEventListener('keydown', onDocumentKeyDown, true)
    tick().then(() => {
      if (popover) {
        tabbable(popover).shift()?.focus()
      }
    })
  }

  const hide = () => {
    visible$.set(false)
    document.removeEventListener('click', onDocumentClick, true)
    document.removeEventListener('keydown', onDocumentKeyDown, true)
    trigger?.focus()
  }

  const toggle = () => {
    if (get(visible$)) {
      hide()
    } else {
      show()
    }
  }

  const onTriggerClick = () => {
    toggle()
  }

  const onTriggerKeyDown = (event: KeyboardEvent) => {
    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault()
      toggle()
    }
  }

  const onDocumentClick = (event: MouseEvent) => {
    if (
      popover?.contains(event.target as Node) ||
      trigger?.contains(event.target as Node)
    ) {
      return
    }

    hide()
  }

  const onDocumentKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      hide()
    }
  }

  let trigger: HTMLElement | null = null
  let popover: HTMLElement | null = null

  onBrowserMount(() => {
    trigger = document.getElementById(triggerId)

    if (!trigger) {
      throw new Error('Could not find the trigger for the popover')
    }

    popover = document.getElementById(popoverId)

    if (!popover) {
      throw new Error('Could not find the element for the popover')
    }

    trigger.addEventListener('click', onTriggerClick)
    trigger.addEventListener('keydown', onTriggerKeyDown)

    const popoverFocusTrap = focusTrap(popover)

    const updatePosition = async () => {
      const { x, y } = await computePosition(trigger!, popover!, {
        placement,
        middleware,
      })
      position$.set({ x, y })
    }

    const destroy = autoUpdate(trigger, popover, updatePosition)

    return () => {
      hide()
      destroy()
      trigger?.removeEventListener('click', onTriggerClick)
      trigger?.removeEventListener('keydown', onTriggerKeyDown)
      popoverFocusTrap?.destroy?.()
    }
  })

  return {
    visible: readonly(visible$),
    position: readonly(position$),
    triggerAttrs,
    popoverAttrs,
    show,
    hide,
    toggle,
  }
}

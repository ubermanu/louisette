import { onBrowserMount } from '$lib/helpers/environment.js'
import { generateId } from '$lib/helpers/uuid.js'
import { derived, readonly, writable } from 'svelte/store'
import type { Popover } from './popover.types.js'

/**
 * A popover is a transient view that appears above other content on the screen
 * when a trigger is activated. The focus is transferred to the popover, and the
 * popover is dismissed when the focus is lost.
 */
export const createPopover = (): Popover => {
  const visible$ = writable(false)

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
  }

  const hide = () => {
    visible$.set(false)
  }

  const toggle = () => {
    visible$.update((visible) => !visible)
  }

  const onTriggerClick = () => {
    toggle()
  }

  const onTriggerKeyDown = (event: KeyboardEvent) => {
    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault()
      toggle()
    }

    if (['Escape'].includes(event.key)) {
      event.preventDefault()
      hide()
    }
  }

  onBrowserMount(() => {
    const node = document.getElementById(triggerId)

    if (!node) {
      throw new Error('Could not find the trigger for the popover')
    }

    node.addEventListener('click', onTriggerClick)
    node.addEventListener('keydown', onTriggerKeyDown)

    return () => {
      node.removeEventListener('click', onTriggerClick)
      node.removeEventListener('keydown', onTriggerKeyDown)
    }
  })

  return {
    visible: readonly(visible$),
    triggerAttrs,
    popoverAttrs,
    show,
    hide,
    toggle,
  }
}

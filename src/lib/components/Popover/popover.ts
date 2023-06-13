import type { Action } from 'svelte/action'
import { derived, readonly, writable } from 'svelte/store'
import type { Popover } from './popover.types.js'

/**
 * A popover is a transient view that appears above other content on the screen
 * when a trigger is activated. The focus is transferred to the popover, and the
 * popover is dismissed when the focus is lost.
 */
export const createPopover = (): Popover => {
  const visible$ = writable(false)

  const triggerAttrs = derived(visible$, (visible) => ({
    'aria-haspopup': true,
    'aria-expanded': visible,
  }))

  const popoverAttrs = derived(visible$, (visible) => ({
    inert: !visible ? '' : undefined,
    'aria-hidden': !visible,
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

  const onPopoverKeyDown = (event: KeyboardEvent) => {
    if (['Escape'].includes(event.key)) {
      event.preventDefault()
      hide()
    }
  }

  const useTrigger: Action = (node) => {
    node.addEventListener('click', onTriggerClick)
    node.addEventListener('keydown', onTriggerKeyDown)

    return {
      destroy() {
        node.removeEventListener('click', onTriggerClick)
        node.removeEventListener('keydown', onTriggerKeyDown)
      },
    }
  }

  const usePopover: Action = (node) => {
    node.addEventListener('keydown', onPopoverKeyDown)

    return {
      destroy() {
        node.removeEventListener('keydown', onPopoverKeyDown)
      },
    }
  }

  return {
    visible: readonly(visible$),
    triggerAttrs,
    popoverAttrs,
    trigger: useTrigger,
    popover: usePopover,
    show,
    hide,
    toggle,
  }
}

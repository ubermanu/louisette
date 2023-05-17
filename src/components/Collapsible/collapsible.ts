import { generateId } from '$lib/helpers.js'
import type { Action } from 'svelte/action'
import { derived, get, readonly, writable } from 'svelte/store'

export type CollapsibleConfig = {
  expanded?: boolean
  disabled?: boolean
  onExpandedChange?: (expanded: boolean) => void
}

export const createCollapsible = (config: CollapsibleConfig) => {
  const { expanded, disabled, onExpandedChange } = {
    expanded: false,
    disabled: false,
    ...config,
  }

  const expanded$ = writable(expanded || false)
  const disabled$ = writable(disabled || false)

  const triggerId = generateId()
  const contentId = generateId()

  const triggerProps = derived(
    [expanded$, disabled$],
    ([expanded, disabled]) => ({
      id: triggerId,
      role: 'button',
      'aria-controls': contentId,
      'aria-expanded': expanded,
      'aria-disabled': disabled,
      tabIndex: disabled ? -1 : 0,
    })
  )

  const contentProps = derived([expanded$], ([expanded]) => ({
    id: contentId,
    role: 'region',
    'aria-labelledby': triggerId,
    'aria-hidden': !expanded,
  }))

  function toggle() {
    if (get(disabled$)) return
    expanded$.update((e) => !e)
  }

  const expand = () => {
    if (get(disabled$)) return
    expanded$.set(true)
  }

  function collapse() {
    if (get(disabled$)) return
    expanded$.set(false)
  }

  const onTriggerKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle()
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      collapse()
    }
  }

  const onTriggerClick = () => {
    toggle()
  }

  const useTriggerCollapsible: Action = (node) => {
    node.addEventListener('keydown', onTriggerKeyDown)
    node.addEventListener('click', onTriggerClick)

    return {
      destroy() {
        node.removeEventListener('keydown', onTriggerKeyDown)
        node.removeEventListener('click', onTriggerClick)
      },
    }
  }

  // TODO: Unsubscribe
  expanded$.subscribe((expanded) => {
    onExpandedChange?.(expanded)
  })

  return {
    expanded: readonly(expanded$),
    disabled: disabled$,
    triggerProps,
    contentProps,
    useTriggerCollapsible,
    expand,
    toggle,
    collapse,
  }
}

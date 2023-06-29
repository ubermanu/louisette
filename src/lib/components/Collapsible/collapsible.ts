import { onBrowserMount } from '$lib/helpers/environment.js'
import { generateId } from '$lib/helpers/uuid.js'
import { derived, get, readonly, writable } from 'svelte/store'
import type { Collapsible, CollapsibleConfig } from './collapsible.types.js'

export const createCollapsible = (config?: CollapsibleConfig): Collapsible => {
  const { expanded, disabled } = { ...config }

  const expanded$ = writable(expanded || false)
  const disabled$ = writable(disabled || false)

  const baseId = generateId()
  const triggerId = `${baseId}-trigger`
  const contentId = `${baseId}-content`

  const triggerAttrs = derived(
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

  const contentAttrs = derived([expanded$], ([expanded]) => ({
    id: contentId,
    role: 'region',
    'aria-labelledby': triggerId,
    'aria-hidden': !expanded,
    inert: !expanded ? '' : undefined,
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

  onBrowserMount(() => {
    const node = document.getElementById(triggerId) as HTMLElement | null

    if (!node) {
      throw new Error('No trigger found for this collapsible')
    }

    node.addEventListener('keydown', onTriggerKeyDown)
    node.addEventListener('click', onTriggerClick)

    return () => {
      node.removeEventListener('keydown', onTriggerKeyDown)
      node.removeEventListener('click', onTriggerClick)
    }
  })

  return {
    expanded: readonly(expanded$),
    disabled: disabled$,
    triggerAttrs,
    contentAttrs,
    expand,
    toggle,
    collapse,
  }
}

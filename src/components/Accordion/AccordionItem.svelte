<script lang="ts">
  import { derived } from 'svelte/store'
  import { generateId } from '$lib/helpers'
  import { getContext, onDestroy } from 'svelte'
  import { v4 as uuid } from '@lukeed/uuid'
  import type { Action } from 'svelte/action'

  export let defaults = {
    expanded: false,
    disabled: false,
  }

  const id = uuid()
  const triggerId = generateId()
  const contentId = generateId()

  const accordion = getContext('accordion')
  const { triggers, expanded, disabled } = accordion

  // Register this trigger with the accordion
  $triggers = [...$triggers, { id }]

  if (defaults?.expanded) {
    accordion.open(id)
  }

  if (defaults?.disabled) {
    $disabled = [...$disabled, id]
  }

  const state = derived([expanded, disabled], ([e, d], set) => {
    set({ expanded: e.includes(id), disabled: d.includes(id) })
  })

  const triggerProps = derived(state, (s) => ({
    id: triggerId,
    role: 'button',
    'aria-controls': contentId,
    'aria-expanded': s.expanded,
    'aria-disabled': s.disabled,
    tabIndex: s.disabled ? -1 : 0,
  }))

  const contentProps = derived(state, (s) => ({
    id: contentId,
    role: 'region',
    'aria-labelledby': triggerId,
    'aria-hidden': !s.expanded,
  }))

  const onTriggerKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      accordion.toggle(id)
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      accordion.close(id)
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      accordion.getPrevEnabledTrigger(id)?.element?.focus()
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      accordion.getNextEnabledTrigger(id)?.element?.focus()
    }

    if (event.key === 'Home') {
      event.preventDefault()
      accordion.getFirstEnabledTrigger()?.element?.focus()
    }

    if (event.key === 'End') {
      event.preventDefault()
      accordion.getLastEnabledTrigger()?.element?.focus()
    }
  }

  const onTriggerClick = () => {
    accordion.toggle(id)
  }

  // Expose the trigger element to the accordion (mainly for focus management)
  const triggerRef: Action = (node) => {
    $triggers = $triggers.map((t) => {
      if (t.id === id) {
        return { ...t, element: node }
      }
      return t
    })
  }

  onDestroy(() => {
    $triggers = $triggers.filter((t) => t.id !== id)
  })
</script>

<slot
  disabled={$state.disabled}
  expanded={$state.expanded}
  triggerProps={$triggerProps}
  contentProps={$contentProps}
  {triggerRef}
  {onTriggerClick}
  {onTriggerKeyDown}
/>

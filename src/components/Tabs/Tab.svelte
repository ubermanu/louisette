<script lang="ts">
  import { derived } from 'svelte/store'
  import { getContext, onDestroy } from 'svelte'
  import type { Action } from 'svelte/action'
  import { generateId } from '$lib/helpers.js'

  export let defaults = {
    selected: false,
    disabled: false,
  } as {
    key: string
    selected?: boolean
    disabled?: boolean
  }

  if (!defaults?.key) {
    throw new Error(
      'The key has to be defined for the tab, so it can match a tab panel'
    )
  }

  const key = defaults?.key
  const id = generateId()

  const provider = getContext('tabs')
  const { tabs, panels, selected, disabled, orientation, behavior } = provider

  $tabs = [...$tabs, { id, key }]

  if (defaults?.selected) {
    provider.open(key)
  }

  if (defaults?.disabled) {
    $disabled = [...$disabled, key]
  }

  const state = derived([selected, disabled], ([s, d]) => ({
    selected: s === key,
    disabled: d.includes(key),
  }))

  const tabProps = derived([state, panels], ([s, p]) => ({
    id: id,
    role: 'tab',
    'aria-selected': s.selected,
    'aria-controls': p.find((p) => p.key === key)?.id,
    tabindex: s.selected ? 0 : -1,
    'aria-disabled': s.disabled,
  }))

  const tabRef: Action = (node) => {
    $tabs = $tabs.map((t) => {
      if (t.id === id) {
        return { ...t, element: node }
      }
      return t
    })
  }

  const onTabClick = () => {
    provider.open(key)
  }

  const onTabKeyDown = (event: KeyboardEvent) => {
    if (
      (event.key === 'Enter' || event.key === ' ') &&
      $behavior === 'manual'
    ) {
      event.preventDefault()
      provider.open(key)
    }

    if (event.key === 'ArrowLeft' && $orientation === 'horizontal') {
      event.preventDefault()
      provider.getPrevEnabledTab(id)?.element?.focus()
    }

    if (event.key === 'ArrowRight' && $orientation === 'horizontal') {
      event.preventDefault()
      provider.getNextEnabledTab(id)?.element?.focus()
    }

    if (event.key === 'ArrowUp' && $orientation === 'vertical') {
      event.preventDefault()
      provider.getPrevEnabledTab(id)?.element?.focus()
    }

    if (event.key === 'ArrowDown' && $orientation === 'vertical') {
      event.preventDefault()
      provider.getNextEnabledTab(id)?.element?.focus()
    }

    if (event.key === 'Home') {
      event.preventDefault()
      provider.getFirstEnabledTab()?.element?.focus()
    }

    if (event.key === 'End') {
      event.preventDefault()
      provider.getLastEnabledTab()?.element?.focus()
    }
  }

  const onTabFocus = () => {
    if ($behavior === 'auto') {
      provider.open(key)
    }
  }

  onDestroy(() => {
    $tabs = $tabs.filter((t) => t.id !== id)
  })
</script>

<slot
  selected={$state.selected}
  disabled={$state.disabled}
  tabProps={$tabProps}
  {tabRef}
  {onTabClick}
  {onTabKeyDown}
  {onTabFocus}
/>

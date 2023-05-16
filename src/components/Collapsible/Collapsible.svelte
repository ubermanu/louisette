<script lang="ts">
  import { derived, writable } from 'svelte/store'
  import { generateId } from '$lib/helpers'

  export let defaults = {
    expanded: false,
    disabled: false,
  }

  const expanded = writable(defaults?.expanded || false)
  const disabled = writable(defaults?.disabled || false)

  const triggerId = generateId()
  const contentId = generateId()

  const state = derived([expanded, disabled], ([e, d], set) => {
    set({ expanded: e, disabled: d })
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

  function toggle() {
    if ($disabled) return
    $expanded = !$expanded
  }

  function close() {
    if ($disabled) return
    $expanded = false
  }

  const onTriggerKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle()
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      close()
    }
  }

  const onTriggerClick = () => {
    toggle()
  }
</script>

<slot
  disabled={$disabled}
  expanded={$expanded}
  triggerProps={$triggerProps}
  contentProps={$contentProps}
  {onTriggerClick}
  {onTriggerKeyDown}
/>

<script lang="ts">
  import { createEventDispatcher, setContext } from 'svelte'
  import { derived, writable } from 'svelte/store'
  import { uuid } from '$lib/helpers'
  import type { CollapsibleContext } from './types'

  const id = uuid()
  const dispatch = createEventDispatcher()

  /** If TRUE, the collapsible is opened. */
  export let open: boolean = false

  /** If TRUE, the collapsible is disabled. */
  export let disabled: boolean = false

  /** Creates a store for the opened state. */
  const opened = writable(open)

  /** Toggles the collapsible. */
  function toggle() {
    if (disabled) {
      return
    }
    dispatch('toggle', { opened: $opened })
    $opened = !$opened
  }

  setContext<CollapsibleContext>('collapsible', {
    id,
    toggle,
    opened: derived(opened, (o) => o),
    disabled,
  })
</script>

<div {...$$restProps}>
  <slot />
</div>

<script lang="ts">
  import { getContext } from 'svelte'
  import type { CollapsibleContext } from './types'

  const collapsible = getContext<CollapsibleContext>('collapsible')
  const { id, toggle, opened, disabled } = collapsible

  const handleClick = () => {
    toggle()
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle()
    }
  }
</script>

<div
  role="button"
  on:click={handleClick}
  on:keydown={handleKeyDown}
  on:click
  on:keydown
  id="{id}-trigger"
  aria-controls="{id}-content"
  aria-expanded={$opened}
  aria-disabled={disabled}
  tabindex={disabled ? -1 : 0}
  {...$$restProps}
>
  <slot />
</div>

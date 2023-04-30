<script lang="ts">
  import { getContext } from 'svelte'
  import { CollapsibleContext } from './types'

  const { id, opened } = getContext<CollapsibleContext>('collapsible')
</script>

<div
  role="region"
  id="{id}-content"
  aria-labelledby="{id}-trigger"
  aria-hidden={!$opened}
  hidden={$opened ? undefined : ''}
  {...$$restProps}
  on:click
  on:keydown
>
  <slot />
</div>

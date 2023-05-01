<script lang="ts">
  import { getContext } from 'svelte'

  export let id: string
  export let label: string
  export let content: string
  export let defaults = {}

  const accordion = getContext('accordion')
  const item = accordion.createItemProvider(defaults)

  const { triggerRef, contentRef } = item
</script>

<div data-testid="accordion-item-{id}">
  <div data-testid="accordion-item-{id}-trigger" use:triggerRef>
    {label}
  </div>
  <div data-testid="accordion-item-{id}-content" use:contentRef>
    {content}
  </div>
</div>

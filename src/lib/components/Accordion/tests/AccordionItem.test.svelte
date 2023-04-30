<script lang="ts">
  import { getContext } from 'svelte'

  export let id: string
  export let label: string
  export let content: string
  export let defaults = {}

  const accordion = getContext('accordion')
  const item = accordion.createItemProvider(defaults)

  const { trigger, content: contentAction } = item
</script>

<div data-testid="accordion-item-{id}">
  <div data-testid="accordion-item-{id}-trigger" use:trigger>
    {label}
  </div>
  <div data-testid="accordion-item-{id}-content" use:contentAction>
    {content}
  </div>
</div>

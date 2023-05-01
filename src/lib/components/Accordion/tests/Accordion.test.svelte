<script lang="ts">
  import { createAccordion } from '../provider'

  export let items: { id: number; label: string; content: string }[] = []
  export let defaults = {}

  const accordion = createAccordion(defaults)
  const { triggerRef, contentRef } = accordion
</script>

<div data-testid="accordion">
  {#each items as item}
    <div data-testid="accordion-item-{item.id}">
      <div
        data-testid="accordion-item-{item.id}-trigger"
        use:triggerRef={{ key: item.id, ...item.defaults }}
      >
        {item.label}
      </div>
      <div
        data-testid="accordion-item-{item.id}-content"
        use:contentRef={{ key: item.id }}
      >
        {item.content}
      </div>
    </div>
  {/each}
</div>

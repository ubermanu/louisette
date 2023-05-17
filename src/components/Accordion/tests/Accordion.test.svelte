<script lang="ts">
  import { createAccordion } from '../accordion'

  export let items: { id: number; label: string; content: string }[] = []
  export let defaults = {}

  const { useAccordion, triggerProps, contentProps } = createAccordion(defaults)
</script>

<div data-testid="accordion" use:useAccordion>
  {#each items as item}
    <div data-testid="accordion-item-{item.id}">
      <div
        data-testid="accordion-item-{item.id}-trigger"
        {...$triggerProps(item.id)}
      >
        {item.label}
      </div>
      <div
        data-testid="accordion-item-{item.id}-content"
        {...$contentProps(item.id)}
      >
        {item.content}
      </div>
    </div>
  {/each}
</div>

<script lang="ts">
  import { createAccordion } from '$lib'

  export let items: { id: number; label: string; content: string }[] = []
  export let defaults = {}

  const { rootAttrs, triggerAttrs, contentAttrs } = createAccordion(defaults)
</script>

<div data-testid="accordion" {...$rootAttrs}>
  {#each items as item}
    <div data-testid="accordion-item-{item.id}">
      <div
        data-testid="accordion-item-{item.id}-trigger"
        {...$triggerAttrs(item.id)}
      >
        {item.label}
      </div>
      <div
        data-testid="accordion-item-{item.id}-content"
        {...$contentAttrs(item.id)}
      >
        {item.content}
      </div>
    </div>
  {/each}
</div>

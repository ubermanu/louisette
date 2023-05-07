<script lang="ts">
  import AccordionProvider from '../Accordion.svelte'
  import AccordionItemProvider from '../AccordionItem.svelte'

  export let items: { id: number; label: string; content: string }[] = []
  export let defaults = {}
</script>

<AccordionProvider {defaults}>
  <div data-testid="accordion">
    {#each items as item}
      <AccordionItemProvider
        defaults={item.defaults}
        let:triggerRef
        let:triggerProps
        let:contentProps
        let:onTriggerClick
        let:onTriggerKeyDown
      >
        <div data-testid="accordion-item-{item.id}">
          <div
            data-testid="accordion-item-{item.id}-trigger"
            use:triggerRef
            on:click={onTriggerClick}
            on:keydown={onTriggerKeyDown}
            {...triggerProps}
          >
            {item.label}
          </div>
          <div data-testid="accordion-item-{item.id}-content" {...contentProps}>
            {item.content}
          </div>
        </div>
      </AccordionItemProvider>
    {/each}
  </div>
</AccordionProvider>

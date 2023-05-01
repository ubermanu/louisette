<script lang="ts">
  import { setContext } from 'svelte'
  import { createAccordionProvider } from '../provider'
  import AccordionItemTest from './AccordionItem.test.svelte'

  export let items: { id: number; label: string; content: string }[] = []
  export let defaults = {}

  const accordion = createAccordionProvider(defaults)
  setContext('accordion', accordion)
</script>

<div data-testid="accordion">
  {#each items as item}
    <AccordionItemTest {...item} />
  {/each}
</div>

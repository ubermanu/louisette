<script>
  import Collapsible from '$lib/components/Collapsible/Collapsible.svelte'
  import Accordion from '$lib/components/Accordion/Accordion.svelte'
  import AccordionItem from '$lib/components/Accordion/AccordionItem.svelte'
</script>

<h2>Collapsible</h2>

<Collapsible label="Trigger">
  <p>Content</p>
</Collapsible>

<h2>Accordion</h2>

<Accordion>
  <AccordionItem label="Item 1">
    <p><button>Focusable button</button></p>
  </AccordionItem>
  <AccordionItem label="Item 2" open>
    <p>Content</p>
  </AccordionItem>
  <AccordionItem label="Item 3" disabled>
    <p>Content</p>
  </AccordionItem>
  <AccordionItem label="Item 4">
    <p>Content</p>
  </AccordionItem>
  <AccordionItem label="Item 5" disabled>
    <p>Content</p>
  </AccordionItem>
</Accordion>

<script>
  import Collapsible from './components/Collapsible.svelte'
  import Accordion from './components/Accordion.svelte'
  import AccordionItem from './components/AccordionItem.svelte'
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

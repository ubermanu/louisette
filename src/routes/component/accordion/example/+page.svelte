<script lang="ts">
  import Accordion from './Accordion.svelte'
  import AccordionItem from './AccordionItem.svelte'
</script>

<Accordion>
  <AccordionItem heading="🦁 Lion">
    Lions are carnivorous and primarily feed on large ungulates, such as zebras
    and wildebeests.
  </AccordionItem>
  <AccordionItem heading="🐘 Elephant" open>
    Elephants are herbivorous and consume a variety of plant materials,
    including grass, leaves, and fruits.
  </AccordionItem>
  <AccordionItem heading="🦒 Giraffe" disabled>
    Giraffes are herbivorous and consume a variety of leaves and buds of acacia,
    mimosa, and wild apricot trees.
  </AccordionItem>
  <AccordionItem heading="🐯 Tiger">
    Tigers are carnivorous and mainly prey on ungulates, such as deer and wild
    boar.
  </AccordionItem>
  <AccordionItem heading="🐻 Bear" disabled>
    Bears are omnivorous and feed on a variety of plant and animal foods and
    insects.
  </AccordionItem>
</Accordion>

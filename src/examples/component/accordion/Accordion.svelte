<script lang="ts">
  import { createAccordion } from '$lib'
  import { setContext } from 'svelte'

  const { accordion, ...accordionContext } = createAccordion()
  setContext('accordion', accordionContext)
</script>

<div use:accordion>
  <slot />
</div>

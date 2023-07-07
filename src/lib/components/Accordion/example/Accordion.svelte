<script lang="ts">
  import { createAccordion } from '$lib'
  import { setContext } from 'svelte'

  const { accordionAttrs, ...accordionContext } = createAccordion()
  setContext('accordion', accordionContext)
</script>

<div {...$accordionAttrs}>
  <slot />
</div>

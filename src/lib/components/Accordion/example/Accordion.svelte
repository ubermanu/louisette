<script lang="ts">
  import { createAccordion } from '$lib'
  import { setContext } from 'svelte'

  const { rootAttrs, ...accordionContext } = createAccordion()
  setContext('accordion', accordionContext)
</script>

<div {...$rootAttrs}>
  <slot />
</div>

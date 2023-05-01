<script lang="ts">
  import { createAccordion } from '$lib'
  import { setContext } from 'svelte'

  /**
   * This component is a simple implementation of the accordion provider.
   *
   * It is not intended to be used in production, but rather as a reference for
   * how you can implement your own component.
   */

  export let multiple: boolean = false

  const accordion = createAccordion({ multiple })
  setContext('accordion', accordion)
</script>

<div class="accordion" {...$$restProps}>
  <slot />
</div>

<style>
  .accordion {
    display: flex;
    flex-direction: column;
  }
</style>

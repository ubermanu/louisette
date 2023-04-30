<script lang="ts">
  import { createAccordionProvider } from '$lib'
  import { setContext } from 'svelte'

  export let multiple: boolean = false

  const accordion = createAccordionProvider({ multiple })
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

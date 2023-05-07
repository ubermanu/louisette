<script lang="ts">
  import Provider from '$lib/components/Accordion/Accordion.svelte'

  /**
   * This component is a simple implementation of the accordion provider.
   *
   * It is not intended to be used in production, but rather as a reference for
   * how you can implement your own component.
   */

  export let multiple: boolean = false
</script>

<Provider defaults={{ multiple }}>
  <div class="accordion" {...$$restProps}>
    <slot />
  </div>
</Provider>

<style>
  .accordion {
    display: flex;
    flex-direction: column;
  }
</style>

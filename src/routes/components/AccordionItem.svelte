<script lang="ts">
  import Provider from '$lib/components/Accordion/AccordionItem.svelte'

  /**
   * This component is a simple implementation of the accordion provider.
   *
   * It is not intended to be used in production, but rather as a reference for
   * how you can implement your own component.
   */

  export let open = false
  export let disabled = false
  export let label
</script>

<Provider
  defaults={{ expanded: open, disabled }}
  let:triggerProps
  let:contentProps
  let:triggerRef
  let:onTriggerClick
  let:onTriggerKeyDown
  let:disabled={isDisabled}
  let:expanded
>
  <div class="accordion-item" {...$$restProps} class:disabled={isDisabled}>
    <div
      class="toggle"
      use:triggerRef
      on:click={onTriggerClick}
      on:keydown={onTriggerKeyDown}
      {...triggerProps}
    >
      {label}
    </div>
    <div class="content" {...contentProps} class:hidden={!expanded}>
      <slot />
    </div>
  </div>
</Provider>

<style>
  .accordion-item {
    border-bottom: 1px solid #ddd;
  }

  .accordion-item.disabled {
    opacity: 0.5;
  }

  .toggle {
    cursor: pointer;
    padding: 1rem;
  }

  .content {
    padding: 1rem;
  }

  .content.hidden {
    display: none;
  }
</style>

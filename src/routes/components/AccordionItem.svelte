<script lang="ts">
  import { getContext } from 'svelte'

  /**
   * This component is a simple implementation of the accordion provider.
   *
   * It is not intended to be used in production, but rather as a reference for
   * how you can implement your own component.
   */

  export let open = false
  export let disabled = false
  export let label

  const accordion = getContext('accordion')
  const item = accordion.createItemProvider({ expanded: open, disabled })

  const { triggerRef, contentRef, state } = item
</script>

<div class="accordion-item" {...$$restProps} class:disabled={$state.disabled}>
  <div class="toggle" use:triggerRef>
    {label}
  </div>
  <div class="content" use:contentRef class:hidden={!$state.expanded}>
    <slot />
  </div>
</div>

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

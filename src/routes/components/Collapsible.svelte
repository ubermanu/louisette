<script lang="ts">
  import { createCollapsible } from '$lib'

  /**
   * This component is a simple implementation of the collapsible provider.
   *
   * It is not intended to be used in production, but rather as a reference for
   * how you can implement your own component.
   */

  export let label
  export let open = false
  export let disabled = false

  const collapsible = createCollapsible({ expanded: open, disabled })
  const { triggerRef, contentRef, state } = collapsible
</script>

<div class="collapsible" class:disabled={$state.disabled}>
  <div class="trigger" use:triggerRef>
    {label}
  </div>
  <div class="content" use:contentRef class:hidden={!$state.expanded}>
    <slot />
  </div>
</div>

<style>
  .collapsible {
    display: flex;
    flex-direction: column;
  }

  .collapsible.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .trigger {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    padding: 0.5rem;
  }

  .content {
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 0 0 0.25rem 0.25rem;
    padding: 0.5rem;
  }

  .hidden {
    display: none;
  }
</style>

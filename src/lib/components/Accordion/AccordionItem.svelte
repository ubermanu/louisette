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

  const { trigger, content, state } = item
</script>

<div class="accordion-item" {...$$restProps}>
  <div class="toggle" use:trigger>
    {label}
  </div>
  <div class="content" use:content class:hidden={!$state.expanded}>
    <slot />
  </div>
</div>

<style>
  .accordion-item {
    border-bottom: 1px solid #ddd;
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

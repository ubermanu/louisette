<script lang="ts">
  import { getContext } from 'svelte'
  import { v4 as uuid } from '@lukeed/uuid'

  /**
   * This component is a simple implementation of the accordion provider.
   *
   * It is not intended to be used in production, but rather as a reference for
   * how you can implement your own component.
   */

  const key = uuid()

  export let open = false
  export let disabled = false
  export let label

  const accordion = getContext('accordion')
  const { triggerRef, contentRef, state } = accordion
</script>

<div
  class="accordion-item"
  {...$$restProps}
  class:disabled={$state.disabled.includes(key)}
>
  <div class="toggle" use:triggerRef={{ key, expanded: open, disabled }}>
    {label}
  </div>
  <div
    class="content"
    use:contentRef={{ key }}
    class:hidden={!$state.expanded.includes(key)}
  >
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

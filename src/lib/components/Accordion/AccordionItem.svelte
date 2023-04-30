<script lang="ts">
  import { getContext } from 'svelte'

  export let open = false
  export let disabled = false
  export let label

  const accordion = getContext('accordion')
  const item = accordion.createItemProvider({ expanded: open, disabled })

  const { triggerAction, contentAction, state } = item
</script>

<div class="accordion-item" {...$$restProps}>
  <div class="toggle" use:triggerAction>
    {label}
  </div>
  <div class="content" use:contentAction class:hidden={!$state.expanded}>
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

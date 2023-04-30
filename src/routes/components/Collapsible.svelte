<script lang="ts">
  import { createCollapsibleProvider } from '$lib'

  export let label
  export let open = false
  export let disabled = false

  const provider = createCollapsibleProvider({ expanded: open, disabled })
  const { triggerProps, contentProps, state } = provider
</script>

<div class="collapsible" class:disabled={!$state.disabled}>
  <div class="trigger" on:click={() => provider.toggle()} {...$triggerProps}>
    {label}
  </div>
  <div class="content" {...$contentProps} class:hidden={!$state.expanded}>
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

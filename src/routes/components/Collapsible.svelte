<script lang="ts">
  import Provider from '$lib/components/Collapsible/Collapsible.svelte'

  export let label
  export let open = false
  export let disabled = false
</script>

<Provider
  defaults={{
    disabled: disabled,
    expanded: open,
  }}
  let:triggerProps
  let:contentProps
  let:onTriggerClick
  let:onTriggerKeyDown
  let:disabled
  let:expanded
>
  <div class="collapsible" class:disabled>
    <div
      class="trigger"
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

<script lang="ts">
  import CollapsibleProvider from '../Collapsible.svelte'

  export let defaults = {}
</script>

<CollapsibleProvider
  {defaults}
  let:triggerProps
  let:contentProps
  let:onTriggerClick
  let:onTriggerKeyDown
>
  <div data-testid="collapsible">
    <div
      data-testid="trigger"
      on:click={onTriggerClick}
      on:keydown={onTriggerKeyDown}
      {...triggerProps}
    >
      Trigger
    </div>
    <div data-testid="content" {...contentProps}>
      <p>Content</p>
    </div>
  </div>
</CollapsibleProvider>

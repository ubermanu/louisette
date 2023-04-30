<script lang="ts">
  import { createCollapsibleProvider } from '../provider'

  export let defaults = {}

  const provider = createCollapsibleProvider(defaults)
  const { triggerProps, contentProps } = provider
</script>

<div data-testid="collapsible">
  <div
    data-testid="trigger"
    on:click={() => provider.toggle()}
    {...$triggerProps}
  >
    Trigger
  </div>
  <div data-testid="content" {...$contentProps}>
    <p>Content</p>
  </div>
</div>

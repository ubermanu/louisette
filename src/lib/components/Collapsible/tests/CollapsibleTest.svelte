<script lang="ts">
  import { createCollapsibleProvider } from '../provider'

  export let defaults = {}

  const provider = createCollapsibleProvider(defaults)
  const { triggerEvents, triggerProps, contentProps } = provider
</script>

<div data-testid="collapsible">
  <div data-testid="trigger" use:triggerEvents {...$triggerProps}>Trigger</div>
  <div data-testid="content" {...$contentProps}>
    <p>Content</p>
  </div>
</div>

<script lang="ts">
  import { createCollapsible } from '../collapsible'

  export let defaults = {}

  const collapsible = createCollapsible(defaults)
  const { useTriggerCollapsible, triggerProps, contentProps } = collapsible
</script>

<div data-testid="collapsible">
  <div data-testid="trigger" use:useTriggerCollapsible {...$triggerProps}>
    Trigger
  </div>
  <div data-testid="content" {...$contentProps}>
    <p>Content</p>
  </div>
</div>

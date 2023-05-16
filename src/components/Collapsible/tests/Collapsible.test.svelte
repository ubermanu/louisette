<script>
  import { createCollapsible } from '../collapsible.js'

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

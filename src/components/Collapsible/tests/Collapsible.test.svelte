<script lang="ts">
  import { createCollapsible } from '../collapsible'

  export let defaults = {}

  const collapsible = createCollapsible(defaults)
  const { useTriggerCollapsible, triggerAttrs, contentAttrs } = collapsible
</script>

<div data-testid="collapsible">
  <div data-testid="trigger" use:useTriggerCollapsible {...$triggerAttrs}>
    Trigger
  </div>
  <div data-testid="content" {...$contentAttrs}>
    <p>Content</p>
  </div>
</div>

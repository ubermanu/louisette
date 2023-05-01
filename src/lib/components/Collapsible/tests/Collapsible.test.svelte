<script lang="ts">
  import { createCollapsibleProvider } from '../provider'

  export let defaults = {}

  const collapsible = createCollapsibleProvider(defaults)
  const { triggerRef, contentRef } = collapsible
</script>

<div data-testid="collapsible">
  <div data-testid="trigger" use:triggerRef>Trigger</div>
  <div data-testid="content" use:contentRef>
    <p>Content</p>
  </div>
</div>

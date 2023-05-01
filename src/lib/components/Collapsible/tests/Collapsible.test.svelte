<script lang="ts">
  import { createCollapsible } from '../provider'

  export let defaults = {}

  const collapsible = createCollapsible(defaults)
  const { triggerRef, contentRef } = collapsible
</script>

<div data-testid="collapsible">
  <div data-testid="trigger" use:triggerRef>Trigger</div>
  <div data-testid="content" use:contentRef>
    <p>Content</p>
  </div>
</div>

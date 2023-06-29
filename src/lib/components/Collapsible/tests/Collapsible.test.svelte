<script lang="ts">
  import { createCollapsible } from '$lib'

  export let defaults = {}

  const { triggerAttrs, contentAttrs } = createCollapsible(defaults)
</script>

<div data-testid="collapsible">
  <div data-testid="trigger" {...$triggerAttrs}>Trigger</div>
  <div data-testid="content" {...$contentAttrs}>
    <p>Content</p>
  </div>
</div>

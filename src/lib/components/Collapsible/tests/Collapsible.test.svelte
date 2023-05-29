<script lang="ts">
  import { createCollapsible } from '$lib'

  export let defaults = {}

  const { trigger, triggerAttrs, contentAttrs } = createCollapsible(defaults)
</script>

<div data-testid="collapsible">
  <div data-testid="trigger" use:trigger {...$triggerAttrs}>Trigger</div>
  <div data-testid="content" {...$contentAttrs}>
    <p>Content</p>
  </div>
</div>

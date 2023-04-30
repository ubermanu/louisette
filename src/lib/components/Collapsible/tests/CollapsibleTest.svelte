<script lang="ts">
  import { createCollapsibleProvider } from '../provider'

  export let defaults = {}

  const provider = createCollapsibleProvider(defaults)
  const { trigger, content } = provider
</script>

<div data-testid="collapsible">
  <div data-testid="trigger" use:trigger>Trigger</div>
  <div data-testid="content" use:content>
    <p>Content</p>
  </div>
</div>

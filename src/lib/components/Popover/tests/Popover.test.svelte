<script lang="ts">
  import { createPopover } from '$lib'

  const { trigger, triggerAttrs, popover, popoverAttrs } = createPopover()
</script>

<button use:trigger {...$triggerAttrs} data-testid="trigger">Push me</button>
<div use:popover {...$popoverAttrs} data-testid="popover">
  <p>Popover content</p>
</div>

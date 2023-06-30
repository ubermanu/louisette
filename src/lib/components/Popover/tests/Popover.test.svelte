<script lang="ts">
  import { createPopover } from '$lib'

  const { triggerAttrs, popoverAttrs } = createPopover()
</script>

<button {...$triggerAttrs} data-testid="trigger">Push me</button>
<div {...$popoverAttrs} data-testid="popover">
  <p>Popover content</p>
</div>

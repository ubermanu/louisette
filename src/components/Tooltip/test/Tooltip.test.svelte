<script lang="ts">
  import { createTooltip } from '../tooltip.js'

  const { triggerEvents, triggerAttrs, tooltipAttrs } = createTooltip()
</script>

<div use:triggerEvents {...$triggerAttrs}>Hover me!</div>

<div {...$tooltipAttrs}>The content of the tooltip</div>

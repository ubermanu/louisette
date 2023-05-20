<script lang="ts">
  import { createTooltip } from '../tooltip.js'

  const { triggerEvents, triggerProps, tooltipProps } = createTooltip()
</script>

<div use:triggerEvents {...$triggerProps}>Hover me!</div>

<div {...$tooltipProps}>The content of the tooltip</div>

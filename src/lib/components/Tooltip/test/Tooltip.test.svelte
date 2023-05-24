<script lang="ts">
  import { createTooltip } from '../tooltip.js'

  const { trigger, triggerAttrs, tooltipAttrs } = createTooltip()
</script>

<div use:trigger {...$triggerAttrs}>Hover me!</div>

<div {...$tooltipAttrs}>The content of the tooltip</div>

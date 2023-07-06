<script lang="ts">
  import { createTooltip } from '$lib'

  const { triggerAttrs, tooltipAttrs } = createTooltip()
</script>

<div {...$triggerAttrs}>Hover me!</div>

<div {...$tooltipAttrs}>The content of the tooltip</div>

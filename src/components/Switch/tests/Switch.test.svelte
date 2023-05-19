<script lang="ts">
  import { createSwitch } from '../switch.js'

  export let defaults = {}

  const { active, switchProps, useSwitch } = createSwitch(defaults)
</script>

<div use:useSwitch {...$switchProps} data-testid="switch">
  Switch is {#if $active}on{:else}off{/if}
</div>

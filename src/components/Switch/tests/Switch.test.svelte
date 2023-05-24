<script lang="ts">
  import { createSwitch } from '../switch.js'

  export let defaults = {}

  const { active, switchAttrs, useSwitch } = createSwitch(defaults)
</script>

<div use:useSwitch {...$switchAttrs} data-testid="switch">
  Switch is {#if $active}on{:else}off{/if}
</div>

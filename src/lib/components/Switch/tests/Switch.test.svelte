<script lang="ts">
  import { createSwitch } from '$lib'

  export let defaults = {}

  const { switch: switchRef, active, switchAttrs } = createSwitch(defaults)
</script>

<div use:switchRef {...$switchAttrs} data-testid="switch">
  Switch is {#if $active}on{:else}off{/if}
</div>

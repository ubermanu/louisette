<script lang="ts">
  import { createSwitch } from '$lib'

  export let defaults = {}

  const { active, switchAttrs } = createSwitch(defaults)
</script>

<div {...$switchAttrs} data-testid="switch">
  Switch is {#if $active}on{:else}off{/if}
</div>

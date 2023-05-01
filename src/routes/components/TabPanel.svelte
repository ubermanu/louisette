<script>
  import { getContext } from 'svelte'
  export let key

  const tabs = getContext('tabs')
  const panel = tabs.createPanelProvider({ key })

  const { state, panelRef } = panel
</script>

{#if $state.active}
  <div use:panelRef>
    <slot />
  </div>
{/if}

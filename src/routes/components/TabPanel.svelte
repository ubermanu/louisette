<script>
  import { getContext } from 'svelte'
  export let key

  const tabs = getContext('tabs')
  const panel = tabs.createPanelProvider({ key })

  const { state, panelRef } = panel
</script>

{#if $state.active}
  <div class="panel" use:panelRef>
    <slot />
  </div>
{/if}

<style>
  .panel {
    border: 1px solid #ccc;
    border-top: none;
    background: #eee;
    padding: 1rem;
  }
</style>

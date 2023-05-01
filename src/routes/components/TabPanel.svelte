<script>
  import { getContext } from 'svelte'

  export let key

  const tabs = getContext('tabs')
  const { panelRef, state } = tabs
</script>

{#if $state.selected === key}
  <div class="panel" use:panelRef={{ key }}>
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

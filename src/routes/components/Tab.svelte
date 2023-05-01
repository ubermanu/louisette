<script>
  import { getContext } from 'svelte'

  export let key

  const tabs = getContext('tabs')
  const item = tabs.createItemProvider({ key })

  const { state, triggerRef } = item
</script>

<div class="tab" class:active={$state.active} use:triggerRef>
  <slot />
</div>

<style>
  .tab {
    display: inline-block;
    cursor: pointer;
    border: 1px solid #ccc;
    border-bottom: none;
    border-radius: 0.5em 0.5em 0 0;
    background: #ddd;
    padding: 0.5em 1em;
  }

  .tab.active {
    border-bottom: 1px solid #ccc;
    background: #eee;
  }

  .tab:hover {
    background: #fff;
  }
</style>

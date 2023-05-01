<script>
  import { getContext } from 'svelte'

  export let key
  export let selected = false
  export let disabled = false

  const tabs = getContext('tabs')
  const { state, tabRef } = tabs
</script>

<div
  class="tab"
  class:active={$state.selected === key}
  class:disabled={$state.disabled.includes(key)}
  use:tabRef={{ key, selected, disabled }}
>
  <slot />
</div>

<style>
  .tab {
    display: inline-block;
    cursor: pointer;
    border: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-radius: 0.5em 0.5em 0 0;
    background: #ddd;
    padding: 0.5em 1em;
  }

  .tab.active {
    border-bottom: none;
    background: #eee;
  }

  .tab.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tab:hover {
    background: #fff;
  }
</style>

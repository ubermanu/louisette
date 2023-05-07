<script>
  import Provider from '$lib/components/Tabs/Tab.svelte'

  export let key
  export let selected = false
  export let disabled = false
</script>

<Provider
  defaults={{ key, selected, disabled }}
  let:selected={active}
  let:disabled={isDisabled}
  let:tabProps
  let:tabRef
  let:onTabClick
  let:onTabKeyDown
  let:onTabFocus
>
  <div
    class="tab"
    class:active
    class:disabled={isDisabled}
    use:tabRef
    on:click={onTabClick}
    on:keydown={onTabKeyDown}
    on:focus={onTabFocus}
    {...tabProps}
  >
    <slot />
  </div>
</Provider>

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

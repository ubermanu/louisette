<script>
  import Provider from '$lib/components/Tabs/Panel.svelte'

  export let key
</script>

<Provider defaults={{ key }} let:selected let:panelProps>
  {#if selected}
    <div class="panel" {...panelProps}>
      <slot />
    </div>
  {/if}
</Provider>

<style>
  .panel {
    border: 1px solid #ccc;
    border-top: none;
    background: #eee;
    padding: 1rem;
  }
</style>

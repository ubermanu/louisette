<script lang="ts">
  import { getContext } from 'svelte'

  const tabs = getContext('tabs')
  const { listProps } = tabs
</script>

<div class="tablist" {...$listProps}>
  <slot />
</div>

<style>
  .tablist {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>

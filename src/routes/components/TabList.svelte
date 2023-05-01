<script lang="ts">
  import { getContext } from 'svelte'

  const tabs = getContext('tabs')
  const { listRef } = tabs
</script>

<div class="tablist" use:listRef>
  <slot />
</div>

<style>
  .tablist {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>

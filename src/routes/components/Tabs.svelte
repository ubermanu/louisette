<script lang="ts">
  import { createTabsProvider } from '$lib'
  import { setContext } from 'svelte'

  const tabs = createTabsProvider()
  setContext('tabs', tabs)
</script>

<div class="tabs">
  <slot />
</div>

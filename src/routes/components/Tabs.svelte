<script lang="ts">
  import { createTabs } from '$lib'
  import { setContext } from 'svelte'

  const tabs = createTabs()
  setContext('tabs', tabs)
</script>

<div class="tabs">
  <slot />
</div>

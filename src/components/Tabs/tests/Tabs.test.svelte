<script lang="ts">
  import { createTabs } from '../provider'

  export let items: { label: string; content: string }[] = []
  export let defaults = {}

  const tabs = createTabs(defaults)
  const { listRef, tabRef, panelRef } = tabs
</script>

<div data-testid="tabs">
  {#if items.length > 0}
    <div data-testid="list" use:listRef>
      {#each items as item, key}
        <div data-testid="tab-{item.id}" use:tabRef={{ key, ...item.defaults }}>
          {item.label}
        </div>
      {/each}
    </div>
  {/if}
  {#each items as item, key}
    <div data-testid="panel-{item.id}" use:panelRef={{ key }}>
      {item.label}
    </div>
  {/each}
</div>

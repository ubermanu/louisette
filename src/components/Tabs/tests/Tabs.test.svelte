<script lang="ts">
  import { createTabs } from '../tabs.js'

  export let defaults = {}
  export let items: { id: number; title: string; content: string }[] = []

  const { useTabs, listProps, tabProps, panelProps } = createTabs(defaults)
</script>

<div use:useTabs data-testid="tabs">
  {#if items.length > 0}
    <div {...$listProps} data-testid="list">
      {#each items as item}
        <div {...$tabProps(item.id)} data-testid="tab-{item.id}">
          {item.title}
        </div>
      {/each}
    </div>
  {/if}
  {#each items as item}
    <div {...$panelProps(item.id)} data-testid="panel-{item.id}">
      {item.content}
    </div>
  {/each}
</div>

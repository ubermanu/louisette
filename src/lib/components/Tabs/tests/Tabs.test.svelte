<script lang="ts">
  import { createTabs } from '$lib'

  export let defaults = {}
  export let items: { id: number; title: string; content: string }[] = []

  const { rootAttrs, listAttrs, tabAttrs, panelAttrs } = createTabs(defaults)
</script>

<div {...$rootAttrs} data-testid="tabs">
  {#if items.length > 0}
    <div {...$listAttrs} data-testid="list">
      {#each items as item}
        <div {...$tabAttrs(item.id)} data-testid="tab-{item.id}">
          {item.title}
        </div>
      {/each}
    </div>
  {/if}
  {#each items as item}
    <div {...$panelAttrs(item.id)} data-testid="panel-{item.id}">
      {item.content}
    </div>
  {/each}
</div>

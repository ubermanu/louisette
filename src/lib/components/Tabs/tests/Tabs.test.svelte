<script lang="ts">
  import { createTabs } from '$lib'

  export let defaults = {}
  export let items: { id: number; title: string; content: string }[] = []

  const { listAttrs, tabAttrs, panelAttrs } = createTabs(defaults)
</script>

<div data-testid="tabs">
  <div {...$listAttrs} data-testid="list">
    {#each items as item}
      <div {...$tabAttrs(item.id)} data-testid="tab-{item.id}">
        {item.title}
      </div>
    {/each}
  </div>
  {#each items as item}
    <div {...$panelAttrs(item.id)} data-testid="panel-{item.id}">
      {item.content}
    </div>
  {/each}
</div>

<script lang="ts">
  import { createToolbar } from '$lib'

  export let defaults = {}

  export let items: { id: string; text: string; disabled: boolean }[] = []

  const { toolbarAttrs, itemAttrs } = createToolbar(defaults)
</script>

<div {...$toolbarAttrs} data-testid="toolbar">
  {#each items as { id, text, disabled }}
    <button {...$itemAttrs(id)} data-testid="toolbar-item-{id}" {disabled}>
      {text}
    </button>
  {/each}
</div>

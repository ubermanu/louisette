<script lang="ts">
  import { createListbox } from '$lib'

  export let defaults = {}
  export let items: { id: number; label: string; value: string }[] = []

  const { listbox, listboxAttrs, optionAttrs } = createListbox(defaults)
</script>

<div use:listbox {...$listboxAttrs} data-testid="listbox">
  {#each items as item, i}
    <div {...$optionAttrs(item.value)} data-testid="option-{item.id}">
      {item.label}
    </div>
  {/each}
</div>

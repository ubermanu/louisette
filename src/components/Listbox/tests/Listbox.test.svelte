<script lang="ts">
  import { createListbox } from '../listbox'

  export let defaults = {}
  export let items: { id: number; label: string; value: string }[] = []

  const { useListbox, listboxProps, optionProps } = createListbox(defaults)
</script>

<div use:useListbox {...$listboxProps} data-testid="listbox">
  {#each items as item, i}
    <div {...$optionProps(item.value)} data-testid="option-{item.id}">
      {item.label}
    </div>
  {/each}
</div>

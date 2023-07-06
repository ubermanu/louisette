<script lang="ts">
  import { createSelect } from '$lib'

  export let defaults = {}

  export let options: { label: string; value: string }[] = []

  const { selectAttrs, buttonAttrs, listboxAttrs, optionAttrs, selectedLabel } =
    createSelect(defaults)
</script>

<div {...$selectAttrs} data-testid="select">
  <button {...$buttonAttrs} data-testid="button">
    {$selectedLabel || 'Select an option'}
  </button>

  <div {...$listboxAttrs} data-testid="listbox">
    {#each options as option}
      <div {...$optionAttrs(option.value)} data-testid="option-{option.value}">
        {option.label}
      </div>
    {/each}
  </div>
</div>

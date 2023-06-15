<script lang="ts">
  import { createSelect } from '$lib'

  export let defaults = {}

  export let options: { label: string; value: string }[] = []

  const {
    button,
    buttonAttrs,
    listbox,
    listboxAttrs,
    optionAttrs,
    selectedLabel,
  } = createSelect(defaults)
</script>

<button use:button {...$buttonAttrs} data-testid="button">
  {$selectedLabel || 'Select an option'}
</button>

<div use:listbox {...$listboxAttrs} data-testid="listbox">
  {#each options as option}
    <div {...$optionAttrs(option.value)} data-testid="option-{option.value}">
      {option.label}
    </div>
  {/each}
</div>

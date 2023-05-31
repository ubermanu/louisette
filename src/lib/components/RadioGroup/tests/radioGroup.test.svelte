<script lang="ts">
  import { createRadioGroup } from '$lib'

  export const defaults = {}

  export const items: { value: string; label: string }[] = []

  const { radioGroup, radioGroupAttrs, radioAttrs } = createRadioGroup(defaults)
</script>

<div use:radioGroup {...$radioGroupAttrs}>
  {#each items as item}
    <div {...$radioAttrs(item.value)}>{item.label}</div>
  {/each}
</div>

<script lang="ts">
  import { setContext } from 'svelte'
  import { createSelect } from '$lib'

  export let value: string
  export let placeholder: string = 'Select an option'

  const {
    trigger,
    triggerAttrs,
    listbox,
    listboxAttrs,
    selectedLabel,
    ...selectContext
  } = createSelect()

  setContext('select', selectContext)
</script>

<button use:trigger {...$triggerAttrs}>
  {$selectedLabel || placeholder}
</button>

<div use:listbox {...$listboxAttrs}>
  <slot />
</div>

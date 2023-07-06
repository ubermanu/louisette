<script lang="ts">
  import { createRadioGroup } from '$lib'
  import { setContext } from 'svelte'

  export let value: string = ''

  const { radioGroupAttrs, ...radioGroupContext } = createRadioGroup({
    selected: value,
  })

  setContext('radioGroup', radioGroupContext)

  const { selected } = radioGroupContext
  $: value = $selected
</script>

<div {...$radioGroupAttrs} class="max-w-xl space-y-2">
  <slot />
</div>

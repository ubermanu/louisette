<script lang="ts">
  import { createRadioGroup } from '$lib'
  import { setContext } from 'svelte'

  const { radioGroup, radioGroupAttrs, ...radioGroupContext } =
    createRadioGroup()
  setContext('radioGroup', radioGroupContext)
</script>

<div use:radioGroup {...$radioGroupAttrs} class="max-w-xl space-y-2">
  <slot />
</div>

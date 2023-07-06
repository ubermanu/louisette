<script lang="ts">
  import { createToggleButton } from '$lib'

  export let defaults = {}

  const { toggleButtonAttrs } = createToggleButton(defaults)
</script>

<div data-testid="toggle-button" {...$toggleButtonAttrs}>Toggle Button</div>

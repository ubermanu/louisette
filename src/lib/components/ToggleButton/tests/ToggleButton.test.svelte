<script lang="ts">
  import { createToggleButton } from '$lib'

  export let defaults = {}

  const { toggleButton, toggleButtonAttrs } = createToggleButton(defaults)
</script>

<div data-testid="toggle-button" use:toggleButton {...$toggleButtonAttrs}>
  Toggle Button
</div>

<script lang="ts">
  import { createToggleButton } from '$lib'

  export let defaults = {}

  const { button, buttonAttrs } = createToggleButton(defaults)
</script>

<div data-testid="toggle-button" use:button {...$buttonAttrs}>
  Toggle Button
</div>

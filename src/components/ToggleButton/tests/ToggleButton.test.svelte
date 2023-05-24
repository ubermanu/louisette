<script lang="ts">
  import { createToggleButton } from '../toggleButton'

  export let defaults = {}

  const { useButton, buttonAttrs } = createToggleButton(defaults)
</script>

<div data-testid="toggle-button" use:useButton {...$buttonAttrs}>
  Toggle Button
</div>

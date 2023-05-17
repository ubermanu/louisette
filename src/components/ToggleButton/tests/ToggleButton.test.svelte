<script lang="ts">
  import { createToggleButton } from '../toggleButton'

  export let defaults = {}

  const { useButton, buttonProps } = createToggleButton(defaults)
</script>

<div data-testid="toggle-button" use:useButton {...$buttonProps}>
  Toggle Button
</div>

<script lang="ts">
  import { createButton } from '../button'

  export let defaults = {}

  const button = createButton(defaults)
  const { useButton, buttonProps } = button
</script>

<div data-testid="button" use:useButton {...$buttonProps}>Button</div>

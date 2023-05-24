<script lang="ts">
  import { createButton } from '../button'

  export let defaults = {}

  const button = createButton(defaults)
  const { useButton, buttonAttrs } = button
</script>

<div data-testid="button" use:useButton {...$buttonAttrs}>Button</div>

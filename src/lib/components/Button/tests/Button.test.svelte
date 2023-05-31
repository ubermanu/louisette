<script lang="ts">
  import { createButton } from '$lib'

  export let defaults = {}

  const { button, buttonAttrs } = createButton(defaults)
</script>

<div data-testid="button" use:button {...$buttonAttrs}>Button</div>

<script lang="ts">
  import { createButton } from '$lib'

  export let defaults = {}

  const { buttonAttrs } = createButton(defaults)
</script>

<div data-testid="button" {...$buttonAttrs}>Button</div>

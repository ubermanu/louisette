<script lang="ts">
  import { createCheckbox } from '$lib'

  export let defaults = {}

  const { checked, indeterminate, checkboxAttrs, checkbox } =
    createCheckbox(defaults)
</script>

<div use:checkbox {...$checkboxAttrs} data-testid="checkbox">
  <div data-testid="checkmark">
    {$indeterminate ? '-' : $checked ? '✓' : ' '}
  </div>
  Click me
</div>

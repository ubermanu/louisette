<script lang="ts">
  import { createCheckbox } from '../checkbox.js'

  export let defaults = {}

  const { checked, indeterminate, checkboxAttrs, useCheckbox } =
    createCheckbox(defaults)
</script>

<div use:useCheckbox {...$checkboxAttrs} data-testid="checkbox">
  <div data-testid="checkmark">
    {$indeterminate ? '-' : $checked ? '✓' : ' '}
  </div>
  Click me
</div>

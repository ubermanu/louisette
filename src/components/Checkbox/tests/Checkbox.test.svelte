<script lang="ts">
  import { createCheckbox } from '../checkbox.js'

  export let defaults = {}

  const { checked, checkboxProps, useCheckbox } = createCheckbox(defaults)
</script>

<div use:useCheckbox {...$checkboxProps} data-testid="checkbox">
  <div data-testid="checkmark">{$checked ? '✔' : '❌'}</div>
  Click me
</div>

<script lang="ts">
  import { createCheckbox } from '$lib'

  export let defaults = {}

  const { checked, indeterminate, checkboxAttrs } = createCheckbox(defaults)
</script>

<div {...$checkboxAttrs} data-testid="checkbox">
  <div data-testid="checkmark">
    {$indeterminate ? '-' : $checked ? '✓' : ' '}
  </div>
  Click me
</div>

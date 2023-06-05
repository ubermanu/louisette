<script lang="ts">
  import { Square, CheckSquare } from 'lucide-svelte'
  import { createCheckbox } from '$lib'

  const { checkbox, checkboxAttrs, checked } = createCheckbox()
</script>

<div
  use:checkbox
  {...$checkboxAttrs}
  class="flex cursor-pointer items-center gap-2 rounded-md p-2 transition-colors"
>
  <svelte:component
    this={$checked ? CheckSquare : Square}
    class="h-5 w-5 flex-shrink-0"
  />
  <span>
    <slot />
  </span>
</div>

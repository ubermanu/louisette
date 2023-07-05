<script lang="ts">
  import { Square, CheckSquare } from 'lucide-svelte'
  import { createCheckbox } from '$lib'

  const { checkboxAttrs, checked } = createCheckbox()
</script>

<div
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

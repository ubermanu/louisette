<script lang="ts">
  import { createToolbar } from '$lib'
  import { setContext } from 'svelte'

  const { toolbarAttrs, ...toolbarContext } = createToolbar()
  setContext('toolbar', toolbarContext)
</script>

<div
  {...$toolbarAttrs}
  class="flex gap-2 rounded bg-white p-2 shadow dark:bg-neutral-900 dark:text-white"
>
  <slot />
</div>

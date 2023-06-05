<script lang="ts">
  import { useDrag } from '$lib'

  export let value: string

  const { dragging, drag, draggableAttrs } = useDrag()
</script>

<button
  use:drag={value}
  {...$draggableAttrs}
  class="rounded border-2 border-transparent p-2 transition-colors transition-opacity hover:bg-neutral-200 dark:hover:bg-neutral-700"
  class:is-dragging={$dragging}
>
  {value}
</button>

<style lang="postcss">
  .is-dragging {
    @apply border-amber-500 opacity-50;
  }
</style>

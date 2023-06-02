<script lang="ts">
  import { useDrop } from '$lib'

  export let items: string[] = []

  const { drop, hovering } = useDrop({
    onDrop: (event) => {
      const item = event.dataTransfer.getData('text/plain')
      items = [...items, item]
    },
  })
</script>

<div
  use:drop
  class="mb-2 flex min-h-[3rem] max-w-md flex-wrap gap-2 rounded-md border-2 border-transparent bg-amber-50 p-2 shadow dark:bg-amber-950"
  class:is-hovering={$hovering}
>
  {#each items as item}
    <div class="select-none p-1">{item}</div>
  {/each}
</div>

<style lang="postcss">
  .is-hovering {
    @apply border-dashed border-amber-500 transition-colors;
  }
</style>

<script lang="ts">
  import { Smile, Frown } from 'lucide-svelte'
  import { usePress } from '$lib'

  const { press, pressed } = usePress()
</script>

<button
  use:press
  class="inline-flex select-none items-center rounded bg-neutral-200 p-2 shadow-sm hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"
  class:is-pressed={$pressed}
>
  <svelte:component this={$pressed ? Smile : Frown} class="mr-2 h-5 w-5" />
  <slot />
</button>

<style lang="postcss">
  .is-pressed {
    @apply bg-green-200 dark:bg-green-700;
  }
</style>

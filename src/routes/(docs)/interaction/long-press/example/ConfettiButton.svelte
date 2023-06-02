<script lang="ts">
  import { useLongPress } from '$lib'
  import confetti from 'canvas-confetti'

  let threshold = 1000

  const { longPress, pressed } = useLongPress({
    threshold,
    onLongPress: () => confetti(),
  })
</script>

<button
  use:longPress
  class="inline-flex select-none items-center rounded bg-neutral-200 p-2 shadow-sm hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"
  class:is-pressed={$pressed}
>
  <slot />
</button>

<style lang="postcss">
  .is-pressed {
    @apply scale-95 shadow-none;
  }
</style>

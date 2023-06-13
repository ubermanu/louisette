<script lang="ts">
  import { useFocusVisible } from '$lib'

  const { focusVisible, focused } = useFocusVisible()
</script>

<button
  use:focusVisible
  class="inline-flex select-none items-center rounded bg-neutral-200 p-2 shadow-sm hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"
  class:is-focus-visible={$focused}
>
  <span>Focus me using the keyboard</span>
</button>

<style lang="postcss">
  .is-focus-visible {
    @apply bg-green-200 dark:bg-green-700;
  }
</style>

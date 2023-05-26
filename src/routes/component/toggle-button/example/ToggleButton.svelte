<script lang="ts">
  import { Circle, CheckCircle } from 'lucide-svelte'
  import { createToggleButton } from '$lib'

  const { button, buttonAttrs, checked } = createToggleButton()
</script>

<button
  use:button
  {...$buttonAttrs}
  class:is-checked={$checked}
  class="inline-flex w-auto select-none items-center gap-2 rounded-md bg-accent px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-accent-400 focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-opacity-75 dark:hover:bg-accent-400"
  on:click
  on:keydown
  on:keypress
  on:keyup
>
  <svelte:component this={$checked ? CheckCircle : Circle} class="h-5 w-5" />
  <slot />
</button>

<style lang="postcss">
  .is-checked {
    @apply bg-green-700 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600;
  }
</style>

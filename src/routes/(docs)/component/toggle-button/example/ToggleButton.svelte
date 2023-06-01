<script lang="ts">
  import { Circle, CheckCircle } from 'lucide-svelte'
  import { createToggleButton } from '$lib'

  const { toggleButton, toggleButtonAttrs, checked } = createToggleButton()
</script>

<div
  use:toggleButton
  {...$toggleButtonAttrs}
  class:is-checked={$checked}
  class="inline-flex w-auto select-none items-center gap-2 rounded-md bg-accent px-4 py-2 text-base font-medium text-white shadow-sm transition duration-150 ease-in-out hover:bg-accent-400 focus-visible:ring focus-visible:ring-accent focus-visible:ring-opacity-50 active:bg-accent-700 active:shadow-inner dark:hover:bg-accent-400 dark:focus-visible:ring-accent-400 dark:focus-visible:ring-opacity-50 dark:active:bg-accent-700"
  on:click
  on:keydown
  on:keypress
  on:keyup
>
  <svelte:component this={$checked ? CheckCircle : Circle} class="h-5 w-5" />
  <slot />
</div>

<style lang="postcss">
  .is-checked {
    @apply bg-green-700 hover:bg-green-600 active:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600 dark:active:bg-green-800;
  }
</style>

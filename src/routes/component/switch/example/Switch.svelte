<script lang="ts">
  import { createSwitch } from '$lib'

  const { switch: switchRef, switchAttrs, active } = createSwitch()
</script>

<div
  use:switchRef
  {...$switchAttrs}
  class="flex h-6 w-12 cursor-pointer items-center rounded-full bg-white text-neutral-900 shadow-inner shadow-md transition-colors
  duration-200 ease-in-out focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
  class:is-active={$active}
>
  <div
    class="transition-margin mx-1 h-4 w-4 rounded-full bg-white shadow-md duration-300 ease-in-out"
    class:ml-auto={$active}
  />
</div>

<style lang="postcss">
  .is-active {
    @apply bg-blue-500 dark:bg-blue-400;
  }
</style>

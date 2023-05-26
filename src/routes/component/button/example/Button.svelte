<script lang="ts">
  import { createButton } from '$lib'

  const { button, buttonAttrs } = createButton()
</script>

<div
  use:button
  {...$buttonAttrs}
  class="inline-flex w-auto select-none items-center rounded-md border border-transparent bg-accent-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-accent-400 focus:outline-none focus-visible:ring focus-visible:ring-accent-500 focus-visible:ring-opacity-50"
  on:click
  on:keydown
  on:keypress
  on:keyup
>
  <slot />
</div>

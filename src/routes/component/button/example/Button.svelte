<script lang="ts">
  import { createButton } from '$lib'

  const { button, buttonAttrs } = createButton()
</script>

<div
  use:button
  {...$buttonAttrs}
  class="inline-flex w-auto select-none items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
  on:click
  on:keydown
  on:keypress
  on:keyup
>
  <slot />
</div>

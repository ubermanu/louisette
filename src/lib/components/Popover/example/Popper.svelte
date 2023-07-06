<script lang="ts">
  import { createPopover } from '$lib'

  export let title: string

  const { triggerAttrs, popoverAttrs, visible, position } = createPopover({
    placement: 'bottom',
  })
</script>

<button
  {...$triggerAttrs}
  class="mx-auto flex w-auto select-none items-center rounded-md border border-transparent bg-accent-500 px-4 py-2 text-base font-medium text-white shadow-sm transition duration-150 ease-in-out hover:bg-accent-400 focus:outline-none focus-visible:ring focus-visible:ring-accent-500 focus-visible:ring-opacity-50 active:bg-accent-700 active:shadow-inner"
>
  {title}
</button>

<div
  {...$popoverAttrs}
  class="absolute mt-2 w-full max-w-sm rounded bg-neutral-100 p-4 shadow dark:bg-neutral-900"
  class:hidden={!$visible}
  style:left={$position.x + 'px'}
  style:top={$position.y + 'px'}
>
  <slot />
</div>

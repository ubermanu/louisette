<script lang="ts">
  import { createTooltip } from '$lib'
  import { size, type Placement } from '@floating-ui/dom'

  const maxSize = size({
    apply({ availableWidth, availableHeight, elements }) {
      Object.assign(elements.floating.style, {
        maxWidth: `${availableWidth}px`,
        maxHeight: `${availableHeight}px`,
      })
    },
  })

  export let placement: Placement = 'right'

  const { triggerAttrs, tooltipAttrs, visible, position } = createTooltip({
    placement,
    middleware: [maxSize],
  })
</script>

<button {...$triggerAttrs} class="inline-block rounded p-1">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
</button>

<div
  {...$tooltipAttrs}
  class="absolute z-10 w-max rounded bg-white p-2 text-xs shadow dark:bg-neutral-900 max-md:max-w-xs"
  class:hidden={!$visible}
  style:left={$position.x + 'px'}
  style:top={$position.y + 'px'}
>
  <slot />
</div>

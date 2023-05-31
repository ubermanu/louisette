<script lang="ts">
  import { HelpCircle } from 'lucide-svelte'
  import { createTooltip } from '$lib'
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'
  import { computePosition, autoUpdate, type Placement } from '@floating-ui/dom'

  const { trigger, triggerAttrs, tooltipAttrs, visible } = createTooltip()

  export let placement: Placement = 'right'

  let referenceEl: HTMLElement
  let floatingEl: HTMLElement
  let position = { x: 0, y: 0 }

  if (browser) {
    onMount(() => {
      autoUpdate(referenceEl, floatingEl, () => {
        computePosition(referenceEl, floatingEl, { placement }).then(
          ({ x, y }) => (position = { x, y })
        )
      })
    })
  }
</script>

<button
  bind:this={referenceEl}
  use:trigger
  {...$triggerAttrs}
  class="inline-block rounded p-1"
>
  <HelpCircle />
</button>

<div
  bind:this={floatingEl}
  {...$tooltipAttrs}
  class="absolute z-10 w-max rounded bg-white p-2 text-xs shadow dark:bg-neutral-900 max-md:max-w-xs"
  class:hidden={!$visible}
  style:left={position.x + 'px'}
  style:top={position.y + 'px'}
>
  <slot />
</div>

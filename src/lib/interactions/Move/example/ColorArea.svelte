<script lang="ts">
  import { useMove } from '$lib'

  let container: HTMLDivElement

  let x = 0
  let y = 0

  const normalize = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max)
  }

  const { move } = useMove({
    onMove: ({ deltaX, deltaY }) => {
      x = normalize(x + deltaX, 0, container.clientWidth - 32)
      y = normalize(y + deltaY, 0, container.clientHeight - 32)
    },
  })
</script>

<div
  bind:this={container}
  class="relative h-64 w-64 rounded bg-gradient-to-br from-red-500 to-black"
>
  <button
    use:move
    class="absolute h-8 w-8 rounded-full border-2 border-neutral-700 bg-neutral-900 shadow-md"
    style="left: {x}px; top: {y}px"
  />
</div>

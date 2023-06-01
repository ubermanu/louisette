<script lang="ts">
  import { useMove } from '$lib'
  import { createEventDispatcher } from 'svelte'
  import { writable } from 'svelte/store'

  const dispatch = createEventDispatcher()

  const position = writable({ x: 0, y: 0 })

  const { move } = useMove({
    onMove: ({ deltaX, deltaY }) => {
      dispatch('move')
      position.set({ x: deltaX, y: deltaY })
    },
    onMoveStart: () => dispatch('move:start'),
    onMoveEnd: () => dispatch('move:end'),
  })
</script>

<div class="relative h-12 w-12" data-testid="color-area">
  <div
    use:move
    class="absolute h-10 w-10 rounded-full bg-black"
    style:left={$position.x + 'px'}
    style:top={$position.y + 'px'}
    data-testid="handle"
  />
</div>

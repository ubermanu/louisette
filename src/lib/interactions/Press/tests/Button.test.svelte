<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte'
  import { usePress } from '$lib'

  const dispatch = createEventDispatcher()

  const { pressed, pressEvents } = usePress({
    onPress: ({ pointerType }) => dispatch('press', { pointerType }),
    onPressStart: ({ pointerType }) => dispatch('press:start', { pointerType }),
    onPressEnd: ({ pointerType }) => dispatch('press:end', { pointerType }),
    onPressUp: ({ pointerType }) => dispatch('press:up', { pointerType }),
  })

  const unsubscribe = pressed.subscribe((isPressed) => {
    dispatch('press:change', { isPressed })
  })

  onDestroy(() => {
    unsubscribe()
  })
</script>

<button use:pressEvents data-testid="button">Press me</button>

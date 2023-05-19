<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { usePress } from '../press'

  const dispatch = createEventDispatcher()

  const { pressEvents } = usePress({
    onPress: ({ pointerType }) => dispatch('press', { pointerType }),
    onPressStart: ({ pointerType }) => dispatch('press:start', { pointerType }),
    onPressEnd: ({ pointerType }) => dispatch('press:end', { pointerType }),
    onPressUp: ({ pointerType }) => dispatch('press:up', { pointerType }),
    onPressChange: (pressed) => dispatch('press:change', { pressed }),
  })
</script>

<button use:pressEvents data-testid="button">Press me</button>

<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { useLongPress } from '$lib'

  export let threshold = 500

  const dispatch = createEventDispatcher()

  const { longPress } = useLongPress({
    threshold,
    onLongPress: () => dispatch('longpress'),
    onLongPressStart: () => dispatch('longpress:start'),
    onLongPressEnd: () => dispatch('longpress:end'),
  })
</script>

<button use:longPress data-testid="button">Press me</button>

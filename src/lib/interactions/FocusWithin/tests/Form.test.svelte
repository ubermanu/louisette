<script lang="ts">
  import { useFocusWithin } from '$lib'
  import { createEventDispatcher, onDestroy } from 'svelte'

  const dispatch = createEventDispatcher()

  const { focusWithin, focused } = useFocusWithin({
    onFocusWithin: () => dispatch('focus:within'),
    onBlurWithin: () => dispatch('blur:within'),
  })

  const unsubscribe = focused.subscribe(() => {
    dispatch('focus:change')
  })

  onDestroy(() => {
    unsubscribe()
  })
</script>

<form use:focusWithin data-testid="form">
  <input type="email" data-testid="email" />
  <input type="password" data-testid="password" />
  <button type="submit" data-testid="submit">Submit</button>
</form>

<button data-testid="outside">Outside</button>

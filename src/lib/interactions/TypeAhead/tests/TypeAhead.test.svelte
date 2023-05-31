<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { useTypeAhead } from '$lib'

  const dispatch = createEventDispatcher()

  const { typing, typeAheadEvents } = useTypeAhead({
    onTypeAhead: (value) => dispatch('typeahead', value),
    onTypeAheadStart: () => dispatch('typeahead:start'),
    onTypeAheadEnd: () => dispatch('typeahead:end'),
  })
</script>

<div use:typeAheadEvents data-testid="typeahead" tabindex="0">
  You are typing: {$typing}
</div>

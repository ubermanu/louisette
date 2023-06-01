<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { useTypeAhead } from '$lib'

  const dispatch = createEventDispatcher()

  const { typing, typeAhead } = useTypeAhead({
    onTypeAhead: (value) => dispatch('typeahead', value),
    onTypeAheadStart: () => dispatch('typeahead:start'),
    onTypeAheadEnd: () => dispatch('typeahead:end'),
  })
</script>

<div use:typeAhead data-testid="typeahead" tabindex="0">
  You are typing: {$typing}
</div>

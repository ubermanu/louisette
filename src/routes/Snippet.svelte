<script lang="ts">
  import { HighlightSvelte } from 'svelte-highlight'

  export let code: string
</script>

<HighlightSvelte code={code?.replace('$lib', 'louisette')} />

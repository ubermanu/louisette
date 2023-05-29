<script lang="ts">
  import { createToolbar } from '$lib'

  const { toolbar, toolbarAttrs, itemAttrs } = createToolbar()
</script>

<div use:toolbar {...$toolbarAttrs} data-testid="toolbar">
  <button {...$itemAttrs('bold')} data-testid="bold">B</button>
  <button {...$itemAttrs('italic')} data-testid="italic">I</button>
  <button {...$itemAttrs('underline')} data-testid="underline">U</button>
</div>

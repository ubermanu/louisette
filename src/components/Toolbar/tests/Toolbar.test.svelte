<script lang="ts">
  import { createToolbar } from '../toolbar.js'

  const { useToolbar, toolbarAttrs, itemAttrs } = createToolbar()
</script>

<div use:useToolbar {...$toolbarAttrs} data-testid="toolbar">
  <button {...$itemAttrs('bold')} data-testid="bold">B</button>
  <button {...$itemAttrs('italic')} data-testid="italic">I</button>
  <button {...$itemAttrs('underline')} data-testid="underline">U</button>
</div>

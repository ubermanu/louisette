<script lang="ts">
  import { createToolbar } from '../toolbar.js'

  const { useToolbar, toolbarProps, itemProps } = createToolbar()
</script>

<div use:useToolbar {...$toolbarProps} data-testid="toolbar">
  <button {...$itemProps('bold')} data-testid="bold">B</button>
  <button {...$itemProps('italic')} data-testid="italic">I</button>
  <button {...$itemProps('underline')} data-testid="underline">U</button>
</div>

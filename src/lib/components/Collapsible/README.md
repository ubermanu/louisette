# Collapsible

Collapsible component provider.

https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

## Usage

```svelte
<script>
  import { createCollapsibleProvider } from 'louisette'

  const collapsible = createCollapsibleProvider()
  const { trigger, content } = collapsible
</script>

<div>
  <div use:trigger>Trigger</div>
  <div use:content>
    <p>Content</p>
  </div>
</div>
```

## Options

- `expanded` (boolean): Whether the collapsible is open or not by default.
- `disabled` (boolean): Whether the collapsible is disabled or not by default.

## Provider

### State

- `expanded` (boolean): Whether the collapsible is open or not.
- `disabled` (boolean): Whether the collapsible is disabled or not.

### Methods

- `toggle()`: Toggles the visibility of the content.
- `open()`: Shows the content.
- `close()`: Hides the content.

### Actions

- `triggerRef`: The action to apply to the trigger element.
- `contentRef`: The action to apply to the content element.

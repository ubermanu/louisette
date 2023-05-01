# Accordion

Accordion component provider.

It basically acts like a group of collapsible, but with the ability to have multiple items open at the same time.

https://www.w3.org/WAI/ARIA/apg/patterns/accordion/

## Usage

Accordion:

```svelte
<script>
  import { createAccordion } from 'louisette'
  import { setContext } from 'svelte'

  const accordion = createAccordion()
  setContext('accordion', accordion)
</script>

<div>
  <slot />
</div>
```

Accordion item:

```svelte
<script>
  import { getContext } from 'svelte'

  const key = Math.random().toString(36).substr(2, 9)

  const accordion = getContext('accordion')
  const { triggerRef, contentRef } = accordion
</script>

<div>
  <div use:triggerRef={{ key }}>Trigger</div>
  <div use:contentRef={{ key }}>
    <p>Content</p>
  </div>
</div>
```

## createAccordion

### Options

- `multiple` (boolean): Whether multiple items can be open at the same time or not by default.

### State

- `multiple` (boolean): Whether multiple items can be open at the same time or not.
- `expanded` (array): The list of expanded items.
- `disabled` (array): The list of disabled items.
- `items` (array): The list of items.
- `triggers` (array): The list of triggers.
- `contents` (array): The list of contents.

### Methods

- `toggle(key)`: Toggles the visibility of the content.
- `open(key)`: Opens the content.
- `close(key)`: Closes the content.
- `openAll()`: Opens all items.
- `closeAll()`: Closes all items.

### Actions

- `triggerRef`: The action to apply to the trigger element.
- `contentRef`: The action to apply to the content element.

## triggerRef

### Options

- `key` (string): The key of the item.
- `expanded` (boolean): Whether the item is open or not by default.
- `disabled` (boolean): Whether the item is disabled or not by default.

## contentRef

### Options

- `key` (string): The key of the item.

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

  const accordion = getContext('accordion')
  const accordionItem = accordion.createItemProvider()

  const { trigger, content } = accordionItem
</script>

<div>
  <div use:trigger>Trigger</div>
  <div use:content>
    <p>Content</p>
  </div>
</div>
```

## createAccordion

### Options

- `multiple` (boolean): Whether multiple items can be open at the same time or not by default.

### Stores

- `multiple` (boolean): Whether multiple items can be open at the same time or not.

### Methods

- `createItemProvider()`: Creates a new item provider.
- `openAll()`: Opens all items.
- `closeAll()`: Closes all items.

## createItemProvider

### Options

- `expanded` (boolean): Whether the item is open or not by default.
- `disabled` (boolean): Whether the item is disabled or not by default.

### Stores

- `expanded` (boolean): Whether the item is open or not.
- `disabled` (boolean): Whether the item is disabled or not.

### Methods

- `toggle()`: Toggles the visibility of the content.
- `open()`: Opens the content.
- `close()`: Closes the content.

### Actions

- `triggerRef`: The action to apply to the trigger element.
- `contentRef`: The action to apply to the content element.

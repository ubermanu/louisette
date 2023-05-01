# Tabs

Tabs component provider.

It basically acts like a group of collapsible, but with the ability to have multiple items open at the same time.

https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

## Usage

Tabs:

```svelte
<script>
  import { createTabsProvider } from 'louisette'
  import { setContext } from 'svelte'

  const tabs = createTabsProvider()
  setContext('tabs', tabs)

  const tablist = tabs.createListProvider({ orientation: 'vertical' })
  const { listRef } = tablist
  setContext('tablist', tablist)
</script>

<div>
  <div use:listRef>
    <slot />
  </div>
</div>
```

Tab item:

```svelte
<script>
  import { getContext } from 'svelte'

  const tablist = getContext('tablist')
  const tab = tablist.createItemProvider()

  const { trigger } = tablist

  export let target
</script>

<div use:trigger={{ target }}>Trigger</div>
```

Tab panel:

```svelte
<script>
  import { getContext } from 'svelte'

  const tabs = getContext('tabs')
  const panel = tabs.createPanelProvider()

  const { panelAction } = panel
</script>

{#if panel.opened}
  <div use:panelAction>
    <slot />
  </div>
{/if}
```

## createAccordionProvider

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

- `open()`: Opens the content.

### Actions

- `trigger`: The action to apply to the trigger element.
- `content`: The action to apply to the content element.

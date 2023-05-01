# Tabs

Tabs component provider.

It basically acts like a group of collapsible, but with the ability to have multiple items open at the same time.

https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

## Usage

Tabs:

```svelte
<script>
  import { createTabs } from 'louisette'
  import { setContext } from 'svelte'

  const tabs = createTabs()
  setContext('tabs', tabs)

  const { listRef } = tabs
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

  export let key

  const tabs = getContext('tabs')
  const { tabRef } = tabs
</script>

<div use:tabRef={{ key }}>
  <slot />
</div>
```

Tab panel:

```svelte
<script>
  import { getContext } from 'svelte'

  export let key

  const tabs = getContext('tabs')
  const { panelRef, state } = tabs
</script>

{#if state.opened}
  <div use:panelRef={{ key }}>
    <slot />
  </div>
{/if}
```

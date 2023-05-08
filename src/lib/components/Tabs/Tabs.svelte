<script lang="ts">
  import { derived, writable } from 'svelte/store'
  import { onMount, setContext } from 'svelte'

  export let defaults = {
    orientation: 'horizontal',
    behavior: 'auto',
  }

  type Tab = {
    id: string
    key: string
    element?: HTMLElement
  }

  type Panel = {
    id: string
    key: string
    element?: HTMLElement
  }

  const orientation = writable<'horizontal' | 'vertical'>(defaults.orientation)
  const behavior = writable<'auto' | 'manual'>(defaults.behavior)

  const tabs = writable<Tab[]>([])
  const panels = writable<Panel[]>([])

  /** The currently selected key */
  const selected = writable('')

  /** The disabled tabs */
  const disabled = writable([])

  function open(key: string) {
    if ($disabled.includes(key)) return
    $selected = key
  }

  /** Returns the previous enabled tab */
  function getPrevEnabledTab(id: string) {
    const index = $tabs.findIndex((t) => t.id === id)
    const prevTab = $tabs[index - 1]
    if (!prevTab) return null
    if ($disabled.includes(prevTab.key)) {
      return getPrevEnabledTab(prevTab.id)
    }
    return prevTab
  }

  /** Returns the next enabled tab */
  function getNextEnabledTab(id: string) {
    const index = $tabs.findIndex((t) => t.id === id)
    const nextTab = $tabs[index + 1]
    if (!nextTab) return null
    if ($disabled.includes(nextTab.key)) {
      return getNextEnabledTab(nextTab.id)
    }
    return nextTab
  }

  /** Returns the first enabled tab */
  function getFirstEnabledTab() {
    const firstTab = $tabs[0]
    if (!firstTab) return null
    if ($disabled.includes(firstTab.key)) {
      return getNextEnabledTab(firstTab.id)
    }
    return firstTab
  }

  /** Returns the last enabled tab */
  function getLastEnabledTab() {
    const lastTab = $tabs[$tabs.length - 1]
    if (!lastTab) return null
    if ($disabled.includes(lastTab.key)) {
      return getPrevEnabledTab(lastTab.id)
    }
    return lastTab
  }

  const listProps = derived(orientation, (o) => ({
    role: 'tablist',
    'aria-orientation': o,
  }))

  setContext('tabs', {
    orientation,
    behavior,
    tabs,
    panels,
    selected,
    disabled,
    open,
    getPrevEnabledTab,
    getNextEnabledTab,
    getFirstEnabledTab,
    getLastEnabledTab,
    listProps,
  })

  // Open the first enabled tab on mount (if none are selected)
  onMount(() => {
    if ($tabs.length > 0 && $selected === '') {
      $selected = getFirstEnabledTab()?.key ?? ''
    }
  })
</script>

<slot orientation={$orientation} behavior={$behavior} {listProps} />

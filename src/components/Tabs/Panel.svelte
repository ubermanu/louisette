<script lang="ts">
  import { derived } from 'svelte/store'
  import { getContext, onDestroy } from 'svelte'
  import { generateId } from '$lib/helpers.js'

  export let defaults = {} as {
    key: string
  }

  const key = defaults?.key
  const id = generateId()

  if (!key) {
    throw new Error(
      'The `key` has to be defined for the tab panel, so it can match a tab'
    )
  }

  const provider = getContext('tabs')
  const { tabs, panels, selected } = provider

  $panels = [...$panels, { id, key }]

  const state = derived([selected], ([s]) => ({
    selected: s === key,
  }))

  const panelProps = derived([tabs, state], ([t, s]) => ({
    id,
    role: 'tabpanel',
    'aria-labelledby': t.find((t) => t.key === key)?.id,
    'aria-hidden': s.selected,
  }))

  onDestroy(() => {
    $panels = $panels.filter((p) => p.id !== id)
  })
</script>

<slot panelProps={$panelProps} selected={$state.selected} />

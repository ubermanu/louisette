<script lang="ts">
  import type { Tabs } from '$lib'
  import { getContext } from 'svelte'

  export let key: string

  const { panelAttrs, active } = getContext<Tabs>('tabs')
</script>

{#if $active === key}
  <div {...$panelAttrs(key)}>
    <slot />
  </div>
{/if}

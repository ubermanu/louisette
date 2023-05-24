<script lang="ts">
  import { getContext } from 'svelte'

  export let key: string

  const { panelAttrs, active } = getContext('tabs')
</script>

{#if $active === key}
  <div {...$panelAttrs(key)}>
    <slot />
  </div>
{/if}

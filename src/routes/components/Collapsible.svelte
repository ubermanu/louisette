<script lang="ts">
  import { createCollapsibleProvider } from '$lib'

  export let label
  export let open = false
  export let disabled = false

  const provider = createCollapsibleProvider({ expanded: open, disabled })
  const { triggerProps, contentProps } = provider
</script>

<div class="collapsible">
  <div
    class="collapsible--trigger"
    on:click={() => provider.toggle()}
    {...$triggerProps}
  >
    {label}
  </div>
  <div class="collapsible--content" {...$contentProps}>
    <slot />
  </div>
</div>

<script lang="ts">
  import { getContext } from 'svelte'

  export let key: string

  const { tabAttrs, active } = getContext('tabs')
</script>

<div
  {...$tabAttrs(key)}
  class="cursor-pointer rounded-md p-2 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50 dark:hover:bg-neutral-700"
  class:is-active={$active === key}
>
  <slot />
</div>

<style lang="postcss">
  .is-active {
    @apply bg-neutral-100 dark:bg-neutral-700;
  }
</style>

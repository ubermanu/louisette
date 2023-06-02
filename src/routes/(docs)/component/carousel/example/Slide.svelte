<script lang="ts">
  import { createKey, type Carousel } from '$lib'
  import { getContext } from 'svelte'

  const key = createKey()

  const { slideAttrs, current } = getContext<Carousel>('carousel')
</script>

<div {...$slideAttrs(key)} class="slide w-full" class:hidden={key !== $current}>
  <slot />
</div>

<style lang="postcss">
  .slide :global(img) {
    @apply h-full w-full rounded object-cover;
  }
</style>

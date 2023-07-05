<script lang="ts">
  import { createCarousel } from '$lib'
  import { setContext } from 'svelte'

  export let controls = true

  const {
    carouselAttrs,
    trackAttrs,
    previousButtonAttrs,
    nextButtonAttrs,
    status,
    ...carouselContext
  } = createCarousel({
    autoplay: true,
    loop: true,
    interval: 2000,
  })

  setContext('carousel', carouselContext)
</script>

<div {...$carouselAttrs} class="relative flex flex-col">
  <div {...$trackAttrs} class="flex flex-row">
    <slot />
  </div>
  {#if controls}
    <button
      {...$previousButtonAttrs}
      class="absolute left-2 top-1/2 -translate-y-1/2 transform rounded-full bg-white text-neutral-950 shadow hover:bg-neutral-300 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
    >
      <svg class="h-6 w-6 md:h-10 md:w-10" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
        />
      </svg>
    </button>
    <button
      {...$nextButtonAttrs}
      class="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-white text-neutral-950 shadow hover:bg-neutral-300 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
    >
      <svg class="h-6 w-6 md:h-10 md:w-10" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"
        />
      </svg>
    </button>
  {/if}
  <div
    class="absolute bottom-2 left-2 inline-block rounded bg-white px-2 py-1 text-xs text-neutral-950 shadow dark:bg-neutral-900 dark:text-white"
    aria-hidden="true"
  >
    {$status}
  </div>
</div>

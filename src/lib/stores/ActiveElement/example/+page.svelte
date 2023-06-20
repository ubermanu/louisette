<script lang="ts">
  import { activeElement } from '$lib'

  $: number = $activeElement?.dataset.number ?? null
</script>

<p class="mb-4 text-sm opacity-60">
  {#if number}
    The active element is <strong>{number}</strong>.
  {:else}
    Focus an element in the grid to see its number.
  {/if}
</p>

<div class="grid w-fit grid-cols-5 grid-rows-4 gap-2">
  {#each Array.from({ length: 20 }) as _, i}
    <button
      class="flex h-10 w-10 items-center justify-center rounded-full bg-accent-200 text-sm shadow hover:bg-accent-100 active:scale-90 dark:bg-accent-700 dark:hover:bg-accent-600 md:h-16 md:w-16 md:text-base"
      data-number={i + 1}
    >
      {i + 1}
    </button>
  {/each}
</div>

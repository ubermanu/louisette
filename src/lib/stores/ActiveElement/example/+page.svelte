<script lang="ts">
  import { activeElement } from '$lib'

  $: number = $activeElement?.dataset.number ?? null
</script>

<p class="text-sm opacity-60">
  {#if number}
    The active element is <strong>{number}</strong>.
  {:else}
    Focus an element in the grid to see its number.
  {/if}
</p>

<div class="grid w-max grid-cols-5 grid-rows-4 gap-2">
  {#each Array.from({ length: 20 }) as _, i}
    <button
      class="flex h-16 w-16 items-center justify-center rounded-full bg-accent-200 shadow hover:bg-accent-100 active:scale-90 dark:bg-accent-700 dark:hover:bg-accent-600"
      data-number={i + 1}
    >
      {i + 1}
    </button>
  {/each}
</div>

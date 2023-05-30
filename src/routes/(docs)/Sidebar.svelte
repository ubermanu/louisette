<script lang="ts">
  import { page } from '$app/stores'

  $: components = $page?.data?.components ?? []
</script>

<div class="rounded-lg bg-white p-4 shadow dark:bg-neutral-900">
  <nav aria-label="Components">
    <ul class="space-y-2">
      {#each components as { name, url }}
        <li class="w-full">
          <a
            href={url}
            aria-current={$page.url.pathname === url ? 'page' : undefined}
            class="block w-full rounded-lg px-4 py-2 transition-colors duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            class:is-active={$page.url.pathname === url}
          >
            {name}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</div>

<style lang="postcss">
  .is-active {
    @apply bg-accent-400 text-white dark:bg-accent-500 dark:text-white;
  }
</style>

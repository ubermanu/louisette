<script lang="ts">
  import { page } from '$app/stores'
  import { X } from 'lucide-svelte'

  $: sidebar = $page?.data?.sidebar ?? []
</script>

<div class="sidebar">
  <div class="mb-4 flex justify-end lg:hidden">
    <button
      class="rounded p-2"
      on:click={() => {
        document.body.classList.remove('sidebar-shown')
      }}
    >
      <X />
    </button>
  </div>

  {#if sidebar.length > 0}
    <nav>
      <ul class="space-y-1">
        {#each sidebar as item}
          {#if item.children}
            <li
              class="p-2 text-xl font-bold capitalize text-neutral-600 dark:text-neutral-400"
            >
              {item.title}
            </li>
            <ul class="space-y-1">
              {#each item.children as { title, href }}
                <li class="w-full">
                  <a
                    {href}
                    aria-current={$page.url.pathname === href
                      ? 'page'
                      : undefined}
                    class="block w-full rounded-lg px-4 py-2 text-sm transition-colors duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    class:is-active={$page.url.pathname === href}
                  >
                    {title}
                  </a>
                </li>
              {/each}
            </ul>
          {:else}
            <li class="w-full">
              <a
                href={item.href}
                aria-current={$page.url.pathname === item.href
                  ? 'page'
                  : undefined}
                class="block w-full rounded-lg px-4 py-2 text-sm transition-colors duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                class:is-active={$page.url.pathname === item.href}
              >
                {item.title}
              </a>
            </li>
          {/if}
        {/each}
      </ul>
    </nav>
  {/if}
</div>

<style lang="postcss">
  .is-active {
    @apply bg-accent-400 text-white dark:bg-accent-500 dark:text-white;
  }

  .sidebar {
    @apply w-full bg-white p-4 shadow-lg dark:bg-neutral-900 max-lg:fixed max-lg:left-0 max-lg:top-0 max-lg:z-10 max-lg:h-screen max-lg:overflow-y-scroll max-lg:transition-transform max-lg:duration-300 max-lg:ease-in-out lg:block lg:max-h-fit lg:max-w-[300px] lg:overflow-y-auto lg:rounded-lg lg:shadow-none lg:dark:bg-neutral-900 lg:dark:text-neutral-100;
  }

  :global(body.sidebar-shown) {
    @apply max-lg:overflow-hidden;
  }

  :global(body:not(.sidebar-shown)) .sidebar {
    @apply max-lg:-translate-x-full max-lg:transform;
  }
</style>

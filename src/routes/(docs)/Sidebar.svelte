<script lang="ts">
  import { page } from '$app/stores'
  import { X } from 'lucide-svelte'
  import SidebarLink from './SidebarLink.svelte'
  import { createMenu } from '$lib'
  import { setContext } from 'svelte'

  const { menuAttrs, ...menuContext } = createMenu()
  setContext('menu', menuContext)

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
      <ul {...$menuAttrs} class="space-y-1">
        {#each sidebar as item}
          {#if item.children}
            <li class="p-2 text-xl font-bold opacity-50">
              {item.title}
            </li>
            <ul class="space-y-1">
              {#each item.children as item}
                <li class="w-full">
                  <SidebarLink href={item.href}>{item.title}</SidebarLink>
                </li>
              {/each}
            </ul>
          {:else}
            <li class="w-full">
              <SidebarLink href={item.href}>{item.title}</SidebarLink>
            </li>
          {/if}
        {/each}
      </ul>
    </nav>
  {/if}
</div>

<style lang="postcss">
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

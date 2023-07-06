<script lang="ts">
  import type { Menu } from '$lib'
  import { getContext } from 'svelte'

  const key: string = getContext('submenu')

  if (!key) {
    throw new Error('Submenu must be used inside a Menu item component')
  }

  const { submenuAttrs, activePath } = getContext<Menu>('menu')
</script>

{#if key}
  <div
    class="absolute left-full top-0 z-10 -mt-2 pl-2"
    class:hidden={!$activePath.includes(key)}
  >
    <ul
      {...$submenuAttrs(key)}
      class="flex w-max min-w-[12rem] flex-col gap-1 rounded bg-white p-2 shadow-lg dark:bg-neutral-900"
    >
      <slot />
    </ul>
  </div>
{/if}

<script lang="ts">
  import { browser } from '$app/environment'
  import { createSwitch } from '$lib'
  import { Moon, Sun } from 'lucide-svelte'
  import { onDestroy } from 'svelte'

  // TODO: Fix first render of the icon
  const {
    switch: switchRef,
    switchAttrs,
    active,
  } = createSwitch({
    active: browser && localStorage?.getItem('theme') === 'dark',
  })

  const unsubscribe = active.subscribe((value) => {
    if (browser) {
      if (value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage?.setItem('theme', value ? 'dark' : 'light')
    }
  })

  onDestroy(() => {
    unsubscribe()
  })
</script>

<svelte:head>
  <script>
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  </script>
</svelte:head>

<button
  use:switchRef
  {...$switchAttrs}
  class="rounded-sm outline-none transition-colors duration-200 hover:text-accent-500"
>
  <svelte:component this={$active ? Moon : Sun} />
</button>

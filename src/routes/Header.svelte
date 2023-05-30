<script>
  import { base } from '$app/paths'
  import logo from '$images/louisette.svg'
  import { Github } from 'lucide-svelte'
  import DarkMode from './DarkMode.svelte'
  import ToggleSidebar from './ToggleSidebar.svelte'
</script>

<div class="container mx-auto flex max-w-6xl items-center gap-4 p-4">
  <a class="mr-auto flex items-center gap-2 rounded p-2" href="{base}/">
    <img src={logo} alt class="h-9 w-9 max-sm:hidden" />
    <span class="font-serif text-2xl md:text-3xl">Louisette</span>
    <span class="ml-2 rounded bg-accent-400 p-1 text-xs text-accent-900">
      {LOUISETTE_VERSION}
    </span>
  </a>
  <div class="flex gap-2 max-sm:gap-1 md:gap-4">
    <a
      href="https://github.com/ubermanu/louisette"
      target="_blank"
      class="flex items-center gap-2 rounded p-2 transition-colors duration-200 hover:text-accent-500 dark:hover:text-accent-400"
    >
      <Github /> <span class="hidden md:inline">GitHub</span>
    </a>
    <DarkMode />
    <ToggleSidebar />
  </div>
</div>

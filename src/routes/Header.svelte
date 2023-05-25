<script>
  import { Github } from 'lucide-svelte'
  import DarkMode from './DarkMode.svelte'
</script>

<div class="container mx-auto flex items-center gap-4 p-4 py-8">
  <a class="mr-auto text-2xl" href="/">Louisette</a>
  <div class="flex gap-4">
    <a
      href="https://github.com/ubermanu/louisette"
      target="_blank"
      class="flex items-center gap-2 rounded-sm transition-colors duration-200 hover:text-accent-500 dark:hover:text-accent-400"
    >
      <Github /> <span class="hidden md:inline">GitHub</span>
    </a>
    <DarkMode />
  </div>
</div>

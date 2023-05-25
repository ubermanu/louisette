<script>
  import '../app.css'
  import Header from './Header.svelte'
</script>

<main
  class="flex min-h-screen w-full flex-col bg-gray-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
>
  <Header />
  <div class="container mx-auto flex-grow">
    <slot />
  </div>
</main>

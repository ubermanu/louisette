<script>
  import '../app.css'
  import '../highlight.less'
  import Header from './Header.svelte'
</script>

<svelte:head>
  <title>Louisette</title>
</svelte:head>

<main
  class="flex min-h-screen w-full flex-col bg-gray-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
>
  <Header />
  <div class="container mx-auto max-w-6xl flex-grow p-4">
    <slot />
  </div>
</main>

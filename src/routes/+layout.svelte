<script>
  import '../app.css'
  import '../highlight.less'
  import Header from './Header.svelte'
  import Sidebar from './Sidebar.svelte'
</script>

<main
  class="flex min-h-screen w-full flex-col bg-gray-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
>
  <Header />
  <div class="container mx-auto flex max-w-6xl flex-grow gap-12 px-4">
    <div class="hidden min-w-[300px] lg:block">
      <Sidebar />
    </div>
    <div class="flex flex-grow flex-col pb-8">
      <slot />
    </div>
  </div>
</main>

<script>
  import Sidebar from './Sidebar.svelte'
</script>

<svelte:head>
  <title>Louisette</title>
</svelte:head>

<div class="flex w-full lg:gap-12">
  <aside class="lg:w-full lg:max-w-[300px]">
    <Sidebar />
  </aside>
  <div class="w-full">
    <slot />
  </div>
</div>

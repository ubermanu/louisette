<script>
  import Sidebar from './Sidebar.svelte'
</script>

<svelte:head>
  <title>Louisette</title>
</svelte:head>

<div class="flex w-full lg:gap-12">
  <div class="lg:w-full lg:max-w-[300px]">
    <Sidebar />
  </div>
  <div class="flex flex-grow flex-col">
    <slot />
  </div>
</div>

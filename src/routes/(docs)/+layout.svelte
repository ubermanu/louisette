<script>
  import Sidebar from './Sidebar.svelte'
</script>

<div class="flex w-full gap-12">
  <div class="hidden min-w-[300px] lg:block">
    <Sidebar />
  </div>
  <div class="flex flex-grow flex-col">
    <slot />
  </div>
</div>

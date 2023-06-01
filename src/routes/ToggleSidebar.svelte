<script lang="ts">
  import { Menu } from 'lucide-svelte'
  import { page } from '$app/stores'
  import { beforeNavigate } from '$app/navigation'

  beforeNavigate(() => {
    document.body.classList.remove('sidebar-shown')
  })
</script>

{#if $page.data.sidebar}
  <button
    class="cursor-pointer rounded p-2 lg:hidden"
    on:click={() => {
      document.body.classList.add('sidebar-shown')
    }}
  >
    <Menu />
  </button>
{/if}

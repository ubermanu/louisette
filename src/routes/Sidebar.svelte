<script lang="ts">
  import { page } from '$app/stores'

  $: components = $page?.data?.components ?? []
</script>

<nav>
  <ul>
    {#each components as { name, url }}
      <li>
        <a href={url}>{name}</a>
      </li>
    {/each}
  </ul>
</nav>

<script lang="ts">
  import Snippet from '../Snippet.svelte'
  import { title } from '../../title.js'
  import { page } from '$app/stores'

  export let data

  $: $title = data.metadata.title
</script>

<div class="prose prose-neutral dark:prose-invert">
  <svelte:component this={data.component} />

  {#if data.example}
    <h2>Example</h2>
    <div class="not-prose">
      <svelte:component this={data.example} />
    </div>
  {/if}

  {#if data.sources?.length > 0}
    <h2>Sources</h2>
    {#each data.sources as { code, filename }}
      <div class="not-prose mb-4">
        <Snippet {code} {filename} />
      </div>
    {/each}
  {/if}
</div>

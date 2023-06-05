<script lang="ts">
  import Snippet from '../Snippet.svelte'
  import { title } from '../../title.js'

  export let data

  $: $title = data.metadata.title
</script>

<div class="prose">
  <svelte:component this={data.component} />
</div>

{#if data.example}
  <h2>Example</h2>
  <div>
    <svelte:component this={data.example} />
  </div>
{/if}

{#if data.sources?.length > 0}
  <h2>Sources</h2>
  {#each data.sources as source}
    <p>{source.filename}</p>
    <Snippet code={source.code} />
  {/each}
{/if}

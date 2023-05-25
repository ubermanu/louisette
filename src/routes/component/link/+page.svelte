<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
</script>

<h1>Link</h1>

<p>The link component is used to navigate between pages.</p>

<h2>Example</h2>

<Page />

<h2>Source</h2>

<code lang="svelte">
  {PageSource.replace('$lib', 'louisette')}
</code>

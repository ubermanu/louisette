<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import ButtonSource from './example/Button.svelte?raw'
</script>

<h1>Button</h1>

<p>Transforms any HTML element into a button.</p>

<blockquote class="warning">
  <p>
    There are a lot chances that you don't need this component. You should
    obviously use a normal <code>button</code> element.
  </p>
</blockquote>

<h2>Example</h2>

<div>
  <Page />
</div>

<h2>Sources</h2>

<p>Page</p>
<code lang="svelte">
  {PageSource.replace('$lib', 'louisette')}
</code>

<p>Button</p>
<code lang="svelte">
  {ButtonSource.replace('$lib', 'louisette')}
</code>

<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import ButtonSource from './example/Button.svelte?raw'
</script>

<h1>Button</h1>

<p>Transforms any HTML element into a button.</p>

<p>
  <a
    href="https://www.w3.org/WAI/ARIA/apg/patterns/button/"
    target="_blank"
    rel="noopener"
  >
    WAI-ARIA: Button Pattern
  </a>
</p>

<blockquote class="warning">
  <p>
    You probably don't need this primitive. Use the native <code
      >&lt;button&gt;</code
    > element instead.
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

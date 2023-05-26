<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
</script>

<h1>Link</h1>

<p>The link component is used to navigate between pages.</p>

<p>
  <a
    href="https://www.w3.org/WAI/ARIA/apg/patterns/link/"
    target="_blank"
    rel="noopener"
  >
    WAI-ARIA: Link Pattern
  </a>
</p>

<blockquote class="warning">
  <p>
    You probably don't need this primitive. Use the native <code>&lt;a&gt;</code
    > element instead.
  </p>
</blockquote>

<h2>Example</h2>

<Page />

<h2>Source</h2>

<code lang="svelte">
  {PageSource.replace('$lib', 'louisette')}
</code>

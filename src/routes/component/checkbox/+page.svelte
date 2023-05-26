<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import CheckboxSource from './example/Checkbox.svelte?raw'
</script>

<h1>Checkbox</h1>

<p>Transforms an HTML element into a checkbox.</p>

<p>
  <a
    href="https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/"
    target="_blank"
    rel="noopener"
  >
    WAI-ARIA: Checkbox Pattern
  </a>
</p>

<blockquote class="warning">
  <p>
    You probably don't need this primitive. Use the native <code
      >&lt;input type="checkbox"&gt;</code
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

<p>Checkbox</p>
<code lang="svelte">
  {CheckboxSource.replace('$lib', 'louisette')}
</code>

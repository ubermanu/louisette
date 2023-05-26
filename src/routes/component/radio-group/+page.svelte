<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import RadioGroupSource from './example/RadioGroup.svelte?raw'
  import RadioSource from './example/Radio.svelte?raw'
</script>

<h1>RadioGroup</h1>

<p>A radio group is a group of radio buttons that are related to each other.</p>

<p>
  <a
    href="https://www.w3.org/WAI/ARIA/apg/patterns/radio/"
    target="_blank"
    rel="noopener"
  >
    WAI-ARIA: Radio Group Pattern
  </a>
</p>

<h2>Example</h2>

<Page />

<h2>Sources</h2>

<p>Page</p>
<code lang="svelte">
  {PageSource.replace('$lib', 'louisette')}
</code>

<p>RadioGroup</p>
<code lang="svelte">
  {RadioGroupSource.replace('$lib', 'louisette')}
</code>

<p>Radio</p>
<code lang="svelte">
  {RadioSource.replace('$lib', 'louisette')}
</code>

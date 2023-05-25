<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import TabsSource from './example/Tabs.svelte?raw'
  import TabSource from './example/Tab.svelte?raw'
  import TabPanelSource from './example/TabPanel.svelte?raw'
</script>

<h1>Tabs</h1>

<p>
  Tabs are a common way to display multiple pages of content in a limited amount
  of space.
</p>

<h2>Example</h2>

<Page />

<h2>Sources</h2>

<p>Page</p>
<code lang="svelte">
  {PageSource.replace('$lib', 'louisette')}
</code>

<p>Tabs</p>
<code lang="svelte">
  {TabsSource.replace('$lib', 'louisette')}
</code>

<p>Tab</p>
<code lang="svelte">
  {TabSource.replace('$lib', 'louisette')}
</code>

<p>TabPanel</p>
<code lang="svelte">
  {TabPanelSource.replace('$lib', 'louisette')}
</code>

<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import TabsSource from './example/Tabs.svelte?raw'
  import TabSource from './example/Tab.svelte?raw'
  import TabPanelSource from './example/TabPanel.svelte?raw'
  import Snippet from '../../Snippet.svelte'
</script>

<h1>Tabs</h1>

<p>
  Tabs are a common way to display multiple pages of content in a limited amount
  of space.
</p>

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
<Snippet code={PageSource} />

<p>Tabs</p>
<Snippet code={TabsSource} />

<p>Tab</p>
<Snippet code={TabSource} />

<p>TabPanel</p>
<Snippet code={TabPanelSource} />

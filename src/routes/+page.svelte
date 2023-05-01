<script>
  import Collapsible from './components/Collapsible.svelte'
  import Accordion from './components/Accordion.svelte'
  import AccordionItem from './components/AccordionItem.svelte'
  import Tabs from './components/Tabs.svelte'
  import TabList from './components/TabList.svelte'
  import Tab from './components/Tab.svelte'
  import TabPanel from './components/TabPanel.svelte'
</script>

<h2>Collapsible</h2>

<Collapsible label="Trigger">
  <p>Content</p>
</Collapsible>

<h2>Accordion</h2>

<Accordion>
  <AccordionItem label="Item 1">
    <p><button>Focusable button</button></p>
  </AccordionItem>
  <AccordionItem label="Item 2" open>
    <p>Content</p>
  </AccordionItem>
  <AccordionItem label="Item 3" disabled>
    <p>Content</p>
  </AccordionItem>
  <AccordionItem label="Item 4">
    <p>Content</p>
  </AccordionItem>
  <AccordionItem label="Item 5" disabled>
    <p>Content</p>
  </AccordionItem>
</Accordion>

<h2>Tabs</h2>

<Tabs>
  <TabList>
    <Tab key="tab-1">Tab 1</Tab>
    <Tab key="tab-2">Tab 2</Tab>
    <Tab key="tab-3">Tab 3</Tab>
    <Tab key="tab-1">Tab 1</Tab>
  </TabList>
  <TabPanel key="tab-1">Tab 1 content</TabPanel>
  <TabPanel key="tab-2">Tab 2 content</TabPanel>
  <TabPanel key="tab-3">Tab 3 content</TabPanel>
</Tabs>

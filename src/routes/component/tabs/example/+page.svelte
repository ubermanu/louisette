<script lang="ts">
  import Tabs from './Tabs.svelte'
  import Tab from './Tab.svelte'
  import TabPanel from './TabPanel.svelte'
</script>

<Tabs>
  <svelte:fragment slot="tabs">
    <Tab key="apples">🍎 Apples</Tab>
    <Tab key="oranges">🍊 Oranges</Tab>
    <Tab key="grapes">🍇 Grapes</Tab>
  </svelte:fragment>
  <TabPanel key="apples">
    There are thousands of apple varieties, each with its own unique taste and
    texture. Apples come in a range of colors, including red, green, and yellow.
  </TabPanel>
  <TabPanel key="oranges">
    They belong to the citrus family and have a refreshing, tangy flavor.
    Oranges come in various varieties, such as navel oranges and Valencia
    oranges.
  </TabPanel>
  <TabPanel key="grapes">
    They grow in clusters on vines and come in different colors, including
    green, red, and purple. Grapes are packed with antioxidants and are a good
    source of vitamin K.
  </TabPanel>
</Tabs>

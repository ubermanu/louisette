<script lang="ts">
  import Menu from './Menu.svelte'
  import MenuItem from './MenuItem.svelte'
  import MenuDivider from './MenuDivider.svelte'
</script>

<Menu>
  <MenuItem href="#">New tab</MenuItem>
  <MenuItem href="#">New window</MenuItem>
  <MenuDivider />
  <MenuItem href="#">
    History
    <Menu slot="submenu">
      <MenuItem href="#">Show full history</MenuItem>
      <MenuItem href="#">History by site</MenuItem>
      <MenuItem href="#">Recently closed</MenuItem>
      <MenuItem href="#">Tabs from other devices</MenuItem>
    </Menu>
  </MenuItem>
  <MenuItem href="#">Downloads</MenuItem>
  <MenuItem href="#">
    Bookmarks
    <Menu slot="submenu">
      <MenuItem href="#">
        Show all bookmarks
        <Menu slot="submenu">
          <MenuItem href="#">Bookmarks bar</MenuItem>
          <MenuItem href="#">Other bookmarks</MenuItem>
        </Menu>
      </MenuItem>
      <MenuItem href="#">Bookmark manager</MenuItem>
      <MenuItem href="#">Add bookmark</MenuItem>
    </Menu>
  </MenuItem>
  <MenuDivider />
  <MenuItem href="#">Settings</MenuItem>
  <MenuItem href="#">Exit</MenuItem>
</Menu>

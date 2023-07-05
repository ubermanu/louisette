<script lang="ts">
  import Menu from './Menu.svelte'
  import MenuItem from './MenuItem.svelte'
  import MenuDivider from './MenuDivider.svelte'
  import MenuSubmenu from './MenuSubmenu.svelte'
</script>

<Menu>
  <MenuItem href="#">New tab</MenuItem>
  <MenuItem href="#">New window</MenuItem>
  <MenuDivider />
  <MenuItem>
    History
    <MenuSubmenu slot="submenu">
      <MenuItem href="#">Show full history</MenuItem>
      <MenuItem href="#">History by site</MenuItem>
      <MenuItem href="#">Recently closed</MenuItem>
      <MenuItem href="#">Tabs from other devices</MenuItem>
    </MenuSubmenu>
  </MenuItem>
  <MenuItem href="#">Downloads</MenuItem>
  <MenuItem>
    Bookmarks
    <MenuSubmenu slot="submenu">
      <MenuItem href="#">
        Show all bookmarks
        <MenuSubmenu slot="submenu">
          <MenuItem href="#">Bookmarks bar</MenuItem>
          <MenuItem href="#">Other bookmarks</MenuItem>
        </MenuSubmenu>
      </MenuItem>
      <MenuItem href="#">Bookmark manager</MenuItem>
      <MenuItem href="#">Add bookmark</MenuItem>
    </MenuSubmenu>
  </MenuItem>
  <MenuDivider />
  <MenuItem href="#">Settings</MenuItem>
  <MenuItem href="#">Exit</MenuItem>
</Menu>

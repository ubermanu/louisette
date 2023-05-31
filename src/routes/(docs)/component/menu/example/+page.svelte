<script lang="ts">
  import Menu from './Menu.svelte'
  import MenuItem from './MenuItem.svelte'
  import MenuDivider from './MenuDivider.svelte'
</script>

<Menu>
  <MenuItem href="#">New file</MenuItem>
  <MenuItem href="#">Save</MenuItem>
  <MenuItem href="#">Save as...</MenuItem>
  <MenuDivider />
  <MenuItem href="#">Settings</MenuItem>
  <MenuItem href="#">Exit</MenuItem>
</Menu>

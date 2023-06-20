<script lang="ts">
  import Combobox from './Combobox.svelte'

  const searchOptions = [
    'Black',
    'Blue',
    'Brown',
    'Green',
    'Orange',
    'Purple',
    'Red',
    'White',
    'Yellow',
  ]
</script>

<Combobox
  options={searchOptions}
  label="Favourite color"
  placeholder="Enter the name of your favourite color..."
  autocomplete
/>

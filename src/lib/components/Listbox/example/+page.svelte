<script lang="ts">
  import Listbox from './Listbox.svelte'
  import ListboxItem from './ListboxItem.svelte'

  let value = ''
</script>

<p class="mb-4 text-sm opacity-60">
  You have selected: <strong>{value || 'nothing'}</strong>
</p>

<Listbox bind:value label="Select your favourite pet">
  <ListboxItem value="🐈">Cat</ListboxItem>
  <ListboxItem value="🐕">Dog</ListboxItem>
  <ListboxItem value="🐇">Rabbit</ListboxItem>
  <ListboxItem value="🐁">Mouse</ListboxItem>
  <ListboxItem value="🐀">Rat</ListboxItem>
  <ListboxItem value="🐦">Bird</ListboxItem>
</Listbox>

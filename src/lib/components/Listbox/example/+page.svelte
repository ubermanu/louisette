<script lang="ts">
  import Listbox from './Listbox.svelte'
  import ListboxItem from './ListboxItem.svelte'

  let value: string | string[] = ''
</script>

<p class="mb-4 text-sm opacity-60">
  You have selected: <strong>{JSON.stringify(value)}</strong>
</p>

<Listbox bind:value label="Select your favourite pet">
  <ListboxItem value="🐈">Cat</ListboxItem>
  <ListboxItem value="🐕">Dog</ListboxItem>
  <ListboxItem value="🐇">Rabbit</ListboxItem>
  <ListboxItem value="🐁">Mouse</ListboxItem>
  <ListboxItem value="🐀">Rat</ListboxItem>
  <ListboxItem value="🐦">Bird</ListboxItem>
</Listbox>

<br>

<p class="mb-4 text-sm opacity-60">
  Same example but multiple:
</p>

<Listbox label="Select your favourite pets" multiple>
  <ListboxItem value="🐈">Cat</ListboxItem>
  <ListboxItem value="🐕">Dog</ListboxItem>
  <ListboxItem value="🐇">Rabbit</ListboxItem>
  <ListboxItem value="🐁">Mouse</ListboxItem>
  <ListboxItem value="🐀">Rat</ListboxItem>
  <ListboxItem value="🐦">Bird</ListboxItem>
</Listbox>

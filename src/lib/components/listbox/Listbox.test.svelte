<script>
  import { createListbox } from './listbox.svelte'

  const data = $props()
  const listbox = createListbox(data)
</script>

<ul {...listbox.list} data-testid="list">
  <li {...listbox.option(1)} data-testid="opt-1">Bird</li>
  <li {...listbox.option(2)} data-testid="opt-2">Cat</li>
  <li {...listbox.option(3)} data-testid="opt-3">Dog</li>
</ul>

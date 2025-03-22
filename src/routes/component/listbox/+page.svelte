<script>
  import { createListbox } from '$lib'

  const listbox = createListbox()

  const kings = [
    'Clovis Ier',
    'Charlemagne',
    'Louis IX',
    'Philippe IV le Bel',
    'François Ier',
    'Louis XIV',
  ]
</script>

<div {...listbox.list} class="m-4">
  {#each kings as king, i}
    <div
      {...listbox.option(String(i))}
      class="cursor-pointer px-4 py-2 select-none hover:bg-slate-200"
      class:bg-slate-200={listbox.activeDescendant === String(i)}
      class:bg-pink-300={listbox.selection.includes(String(i))}
    >
      {king}
    </div>
  {/each}
</div>

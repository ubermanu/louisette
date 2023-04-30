<script>
  import Collapsible from './Collapsible.svelte'
  let open = false
  let disabled = false

  $: console.log({ open, disabled })
</script>

<Collapsible />

<label>
  <input type="checkbox" bind:checked={open} /> Open
</label>

<label>
  <input type="checkbox" bind:checked={disabled} /> Disabled
</label>

<script lang="ts">
  import Select from './Select.svelte'
  import Option from './Option.svelte'

  let value: string = ''
</script>

<p class="mb-4 text-sm opacity-60">
  You have selected the value: <strong>{value || 'nothing'}</strong>
</p>

<Select bind:value>
  <Option value="1">Option 1</Option>
  <Option value="2">Option 2</Option>
  <Option value="3">Option 3</Option>
</Select>

<script lang="ts">
  import Select from './Select.svelte'
  import Option from './Option.svelte'

  let value: string = ''
</script>

<p class="mb-4 text-sm opacity-60">
  You have selected the value: <strong>{value || 'nothing'}</strong>
</p>

<Select bind:value placeholder="Select a transportation method">
  <Option value="🚗">Car</Option>
  <Option value="🚲">Bike</Option>
  <Option value="🚌">Bus</Option>
  <Option value="✈️">Plane</Option>
  <Option value="🚂">Train</Option>
  <Option value="🚶‍♂️">Walk</Option>
</Select>

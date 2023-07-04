<script lang="ts">
  import Popper from './Popper.svelte'
</script>

<Popper title="Resize">
  <div class="flex flex-col space-y-2">
    <div class="flex flex-row gap-2">
      <label for="width">Width</label>
      <input
        type="number"
        id="width"
        name="width"
        min="0"
        max="100"
        value="50"
      />
    </div>
    <div class="flex flex-row gap-2">
      <label for="height">Height</label>
      <input
        type="number"
        id="height"
        name="height"
        min="0"
        max="100"
        value="50"
      />
    </div>
  </div>
</Popper>

<style lang="postcss">
  input {
    @apply w-full rounded bg-white px-2 py-1 text-sm shadow dark:bg-neutral-700 dark:text-neutral-100;
  }
</style>

<script lang="ts">
  import { interactionMode } from '$lib'
</script>

<p class="mb-4 text-sm opacity-60">
  You are currently using a <strong>{$interactionMode || 'unknown'}</strong> device.
</p>

<input
  type="text"
  class="block rounded border border-gray-300 bg-white p-2 shadow-sm dark:border-neutral-700 dark:bg-neutral-700 dark:text-neutral-100 sm:text-sm"
  placeholder="Type some text..."
/>

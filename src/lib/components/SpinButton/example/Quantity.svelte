<script lang="ts">
  import { createSpinButton } from '$lib'

  const { inputAttrs, incrementButtonAttrs, decrementButtonAttrs } =
    createSpinButton()
</script>

<div class="flex rounded shadow">
  <input
    type="text"
    {...$inputAttrs}
    class="w-full rounded-l px-2 py-1 dark:bg-neutral-700"
  />
  <div class="flex flex-shrink flex-col">
    <button
      {...$incrementButtonAttrs}
      class="w-full rounded-tr bg-white px-4 pb-1 pt-2 leading-4 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600"
    >
      +
    </button>
    <button
      {...$decrementButtonAttrs}
      class="w-full rounded-br bg-white px-4 pb-2 pt-1 leading-4 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600"
    >
      -
    </button>
  </div>
</div>

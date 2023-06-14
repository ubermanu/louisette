<script lang="ts">
  import { setContext } from 'svelte'
  import { createSelect } from '$lib'

  export let value: string
  export let placeholder: string = 'Select an option'

  // TODO: implement disabled
  export let disabled: boolean = false

  const {
    opened,
    button,
    buttonAttrs,
    listbox,
    listboxAttrs,
    selectedLabel,
    ...selectContext
  } = createSelect()

  setContext('select', selectContext)
</script>

<div class="relative min-w-[1rem]">
  <button
    use:button
    {...$buttonAttrs}
    class="flex w-full items-center justify-between rounded bg-white px-4 py-2 shadow dark:bg-neutral-700 dark:text-neutral-100"
  >
    <span class:opacity-50={!$selectedLabel}>
      {$selectedLabel || placeholder}
    </span>
    <svg
      class="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.293 6.707a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
      />
    </svg>
  </button>

  <div
    use:listbox
    {...$listboxAttrs}
    class:hidden={!$opened}
    class="absolute z-10 mt-1 w-full space-y-2 rounded-b bg-white p-2 text-sm shadow-lg dark:bg-neutral-700 dark:text-neutral-100"
  >
    <slot />
  </div>
</div>

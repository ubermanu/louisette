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
    class="flex w-full items-center justify-between gap-4 rounded bg-white px-4 py-2 shadow dark:bg-neutral-700 dark:text-neutral-100"
  >
    <span class:opacity-50={!$selectedLabel}>
      {$selectedLabel || placeholder}
    </span>
    <span class="ml-auto" class:rotate-180={$opened}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="h-4 w-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    </span>
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

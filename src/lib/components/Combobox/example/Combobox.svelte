<script lang="ts">
  import { createCombobox } from '$lib'

  export let label: string
  export let placeholder: string = ''
  export let options: string[] = []

  const {
    input,
    inputAttrs,
    listbox,
    listboxAttrs,
    optionAttrs,
    opened,
    activeDescendant,
  } = createCombobox()
</script>

<div class="relative min-w-[1rem]">
  <input
    type="text"
    use:input
    {...$inputAttrs}
    {placeholder}
    aria-label={label}
    class="w-full rounded bg-white px-4 py-2 shadow dark:bg-neutral-700 dark:text-neutral-100"
  />

  <div
    use:listbox
    {...$listboxAttrs}
    class:hidden={!$opened}
    class="absolute z-10 mt-1 w-full space-y-2 rounded-b bg-white p-2 text-sm shadow-lg dark:bg-neutral-700 dark:text-neutral-100"
  >
    {#each options as option}
      <div
        {...$optionAttrs(option)}
        class="flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
        class:is-active-descendant={$activeDescendant === option}
      >
        {option}
      </div>
    {/each}
  </div>
</div>

<style lang="postcss">
  .is-active-descendant {
    @apply bg-neutral-200 dark:bg-neutral-600;
  }
</style>

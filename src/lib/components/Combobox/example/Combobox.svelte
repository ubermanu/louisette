<script lang="ts">
  import { createCombobox } from '$lib'

  export let label: string
  export let placeholder: string = ''
  export let options: string[] = []

  const {
    input,
    inputAttrs,
    button,
    buttonAttrs,
    listbox,
    listboxAttrs,
    optionAttrs,
    opened,
    activeDescendant,
  } = createCombobox()
</script>

<div class="relative min-w-[1rem]">
  <div class="flex gap-1">
    <input
      type="text"
      use:input
      {...$inputAttrs}
      {placeholder}
      aria-label={label}
      class="w-full rounded bg-white px-4 py-2 shadow dark:bg-neutral-700 dark:text-neutral-100"
    />
    <button
      class="ml-auto flex place-items-center rounded bg-white p-2 shadow dark:bg-neutral-700 dark:text-neutral-100"
      use:button
      {...$buttonAttrs}
    >
      <span class:rotate-180={$opened}>
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
  </div>

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

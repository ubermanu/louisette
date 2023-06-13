<script lang="ts">
  import { useFocusWithin } from '$lib'

  const { focusWithin, focused } = useFocusWithin()
</script>

<p class="mb-4 text-sm opacity-60">
  When one of the form fields is focused, the form will have a border.
</p>

<form
  use:focusWithin
  class:is-focus-within={$focused}
  class="w-full max-w-sm rounded-md border-2 border-gray-200 bg-white p-4 shadow-md dark:border-neutral-700 dark:bg-neutral-800"
  on:submit|preventDefault={() => false}
>
  <fieldset class="space-y-4">
    <legend class="text-xl font-bold">Log In</legend>
    <div>
      <label for="email" class="block text-sm">Email</label>
      <input
        id="email"
        type="email"
        class="my-2 w-full rounded bg-neutral-100 p-2 dark:bg-neutral-700"
        autocomplete="off"
      />
    </div>
    <div>
      <label for="password" class="block text-sm">Password</label>
      <input
        id="password"
        type="password"
        class="my-2 w-full rounded bg-neutral-100 p-2 dark:bg-neutral-700"
        autocomplete="off"
      />
    </div>
    <button
      type="submit"
      class="flex w-full select-none items-center justify-center rounded bg-neutral-200 p-2 text-sm shadow-sm hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"
    >
      Log In
    </button>
  </fieldset>
</form>

<style lang="postcss">
  .is-focus-within {
    @apply border-accent-500 border-opacity-50;
  }

  .is-focus-within button {
    @apply bg-accent-500 text-white;
  }
</style>

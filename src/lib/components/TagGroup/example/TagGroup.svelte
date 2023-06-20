<script lang="ts">
  import { createTagGroup } from '$lib'

  export let label: string

  /** @type {{ label: string; value: string }[]} */
  export let options = []

  const { tagGroup, tagGroupAttrs, tagAttrs, dismissButtonAttrs } =
    createTagGroup({
      onDismiss: (key) => {
        options = options.filter((option) => option.value !== key)
      },
    })
</script>

<div
  use:tagGroup
  {...$tagGroupAttrs}
  class="flex flex-wrap gap-2"
  aria-label={label}
>
  {#if options.length > 0}
    {#each options as { label, value }}
      <div
        {...$tagAttrs(value)}
        class="flex w-fit place-items-center rounded-md bg-neutral-300 p-2 text-sm font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
      >
        <span>{label}</span>
        <button {...$dismissButtonAttrs(value)}>
          <svg
            class="ml-1 h-4 w-4 text-neutral-500 dark:text-neutral-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10.7071 10L15.3536 5.35355C15.5488 5.15829 15.5488 4.84171 15.3536 4.64645C15.1583 4.45118 14.8417 4.45118 14.6464 4.64645L10 9.29289L5.35355 4.64645C5.15829 4.45118 4.84171 4.45118 4.64645 4.64645C4.45118 4.84171 4.45118 5.15829 4.64645 5.35355L9.29289 10L4.64645 14.6464C4.45118 14.8417 4.45118 15.1583 4.64645 15.3536C4.84171 15.5488 5.15829 15.5488 5.35355 15.3536L10 10.7071L14.6464 15.3536C14.8417 15.5488 15.1583 15.5488 15.3536 15.3536C15.5488 15.1583 15.5488 14.8417 15.3536 14.6464L10.7071 10Z"
            />
          </svg>
        </button>
      </div>
    {/each}
  {:else}
    <p class="text-sm text-neutral-500 dark:text-neutral-400">
      You don't have any favorite sports yet.
    </p>
  {/if}
</div>

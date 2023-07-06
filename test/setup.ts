import { vi } from 'vitest'

// Let us use `onMount` in our tests.
// https://github.com/testing-library/svelte-testing-library/issues/222#issuecomment-1588987135
vi.mock('svelte', async () => {
  const actual = (await vi.importActual('svelte')) as object
  return {
    ...actual,
    onMount: (await import('svelte/internal')).onMount,
  }
})

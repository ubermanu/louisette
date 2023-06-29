import { onMount } from 'svelte'

export const browser = typeof window !== 'undefined'

export const onBrowserMount = (fn: () => any) => {
  if (browser) {
    onMount(fn)
  }
}

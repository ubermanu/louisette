import { writable } from 'svelte/store'

function createTitle() {
  const { subscribe, set, update } = writable('Louisette')

  return {
    subscribe,
    set: (value: string) => {
      set(`Louisette - ${value}`)
    },
    clear: () => {
      set('Louisette')
    },
  }
}
export const title = createTitle()

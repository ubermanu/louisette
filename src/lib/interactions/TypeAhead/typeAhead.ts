import type { Action } from 'svelte/action'
import { get, readonly, writable } from 'svelte/store'

export type TypeAheadConfig = {
  /** The time in milliseconds to wait before ending the typeahead. */
  threshold?: number

  /** The callback when a new character is pushed. */
  onTypeAhead?: (value: string) => void

  /** The callback when the typeahead starts. */
  onTypeAheadStart?: () => void

  /** The callback when the typeahead ends. */
  onTypeAheadEnd?: () => void
}

export const useTypeAhead = (config?: TypeAheadConfig) => {
  const {
    threshold = 500,
    onTypeAhead,
    onTypeAheadStart,
    onTypeAheadEnd,
  } = { ...config }

  const value$ = writable('')

  let timer: number | undefined

  const start = () => {
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    } else {
      onTypeAheadStart?.()
    }
    timer = window.setTimeout(() => stop(), threshold)
  }

  const stop = () => {
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }
    value$.set('')
    onTypeAheadEnd?.()
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key.length === 1) {
      start()
      value$.update((value) => value + event.key)
      return
    }

    if (event.key === 'Backspace' && get(value$).length > 0) {
      value$.update((value) => value.slice(0, -1))
      return
    }

    // Cancel the timer if the user is typing anything else
    stop()
  }

  const typeAheadEvents: Action = (node) => {
    node.addEventListener('keydown', onKeyDown)

    return {
      destroy: () => {
        node.removeEventListener('keydown', onKeyDown)
      },
    }
  }

  // Call the callback when the user types something
  value$.subscribe((value) => {
    if (value.length > 0) {
      onTypeAhead?.(value)
    }
  })

  return {
    typing: readonly(value$),
    typeAheadEvents,
    stop,
  }
}

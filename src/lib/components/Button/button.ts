import { onBrowserMount } from '$lib/helpers/environment.js'
import { generateId } from '$lib/helpers/uuid.js'
import { derived, get, writable } from 'svelte/store'
import type { Button, ButtonConfig } from './button.types.js'

export const createButton = (config?: ButtonConfig): Button => {
  const { disabled } = { ...config }

  const disabled$ = writable(disabled || false)

  const baseId = generateId()

  const buttonAttrs = derived([disabled$], ([disabled]) => ({
    role: 'button',
    'aria-disabled': disabled,
    tabIndex: disabled ? -1 : 0,
    'data-button': baseId,
  }))

  const onButtonClick = (event: MouseEvent) => {
    if (get(disabled$)) {
      event.preventDefault()
      return
    }
  }

  const onButtonKeyDown = (event: KeyboardEvent) => {
    if (['Enter', ' '].includes(event.key) && get(disabled$)) {
      event.preventDefault()
      return
    }
  }

  onBrowserMount(() => {
    const node = document.querySelector(`[data-button="${baseId}"]`) as HTMLElement | null

    if (!node) {
      throw new Error('Could not find the button')
    }

    node.addEventListener('click', onButtonClick)
    node.addEventListener('keydown', onButtonKeyDown)

    return () => {
      node.removeEventListener('click', onButtonClick)
      node.removeEventListener('keydown', onButtonKeyDown)
    }
  })

  return {
    disabled: disabled$,
    buttonAttrs,
  }
}

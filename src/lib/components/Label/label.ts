import { onBrowserMount } from '$lib/helpers/environment.js'
import { generateId } from '$lib/helpers/uuid.js'
import { readable } from 'svelte/store'
import type { Label } from './label.types.js'

export const createLabel = (): Label => {
  const labelId = generateId()

  const labelAttrs = readable({
    id: labelId,
  })

  const fieldAttrs = readable({
    'aria-labelledby': labelId,
  })

  const onLabelClick = () => {
    const field = document.querySelector<HTMLElement>(
      `[aria-labelledby="${labelId}"]`
    )
    field?.focus()
  }

  onBrowserMount(() => {
    const node = document.getElementById(labelId)

    if (!node) {
      throw new Error('Could not find the label node')
    }

    node.addEventListener('click', onLabelClick)

    return () => {
      node.removeEventListener('click', onLabelClick)
    }
  })

  return {
    labelAttrs,
    fieldAttrs,
  }
}

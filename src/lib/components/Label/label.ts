import { generateId } from '$lib/helpers/uuid.js'
import type { Action } from 'svelte/action'
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

  const onLabelClick = (event: MouseEvent) => {
    const field = document.querySelector(
      `[aria-labelledby="${labelId}"]`
    ) as HTMLElement
    field?.focus()
  }

  const useLabel: Action = (node) => {
    node.addEventListener('click', onLabelClick)

    return {
      destroy() {
        node.removeEventListener('click', onLabelClick)
      },
    }
  }

  return {
    label: useLabel,
    labelAttrs,
    fieldAttrs,
  }
}

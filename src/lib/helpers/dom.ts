import focusableSelectors from 'focusable-selectors'

const focusableSelector = focusableSelectors.join(',')

/** Returns all the focusable elements inside a given node. */
export const getFocusableElements = (node?: HTMLElement): HTMLElement[] => {
  return Array.from(
    (node || document).querySelectorAll<HTMLElement>(focusableSelector)
  )
}

export const getFirstFocusableElement = (
  node?: HTMLElement
): HTMLElement | null => {
  return (node || document).querySelector<HTMLElement>(focusableSelector)
}

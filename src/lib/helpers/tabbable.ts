import focusableSelectors from 'focusable-selectors'

const tabbableSelectors = focusableSelectors.join(',')

export const tabbable = (node: HTMLElement): HTMLElement[] => {
  return Array.from(node.querySelectorAll(tabbableSelectors))
}

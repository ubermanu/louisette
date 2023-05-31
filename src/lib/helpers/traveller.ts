type Traveller = {
  first: () => HTMLElement | null
  last: () => HTMLElement | null
  next: (current: HTMLElement) => HTMLElement | null
  previous: (current: HTMLElement) => HTMLElement | null
  all: () => HTMLElement[]
}

/** Creates a traveller that can navigate a list of elements. */
export const traveller = (
  rootNode: HTMLElement,
  selector: string,
  skip?: (el: HTMLElement) => boolean
): Traveller => {
  const items = () => {
    return Array.from(
      rootNode.querySelectorAll(selector) as NodeListOf<HTMLElement>
    )
  }

  const first = (elements: HTMLElement[]) => {
    return elements.find((el) => !skip?.(el)) ?? null
  }

  const last = (elements: HTMLElement[]) => {
    return elements.reverse().find((el) => !skip?.(el)) ?? null
  }

  const next = (current: HTMLElement) => {
    const list = items()
    const index = list.indexOf(current)
    if (index === -1) {
      return null
    }
    return first(list.slice(index + 1))
  }

  const previous = (current: HTMLElement) => {
    const list = items()
    const index = list.indexOf(current)
    if (index === -1) {
      return null
    }
    return last(list.slice(0, index))
  }

  return {
    first: () => first(items()),
    last: () => last(items()),
    next,
    previous,
    all: () => items(),
  }
}

/** Creates a traveller that can navigate a list of elements. */
export default function traveller(
  root: HTMLElement | Element,
  selector: string,
  skip?: (el: HTMLElement) => boolean
) {
  const items = () => {
    return Array.from(root.querySelectorAll(selector))
  }

  const first = (elements) => {
    return elements.find((el) => !skip?.(el)) ?? null
  }

  const last = (elements) => {
    return elements.reverse().find((el) => !skip?.(el)) ?? null
  }

  const next = (current) => {
    const list = items()
    const index = list.indexOf(current)
    if (index === -1) {
      return null
    }
    return first(list.slice(index + 1))
  }

  const previous = (current) => {
    const list = items()
    const index = list.indexOf(current)
    if (index === -1) {
      return null
    }
    return last(list.slice(0, index))
  }

  const slice = (from: Element, to: Element): Element[] => {
    const list = items()

    const a = list.indexOf(from)
    const b = list.indexOf(to)

    if (a * b < 0) {
      return []
    }

    return list.slice(Math.min(a, b), Math.max(a, b))
  }

  return {
    first: () => first(items()),
    last: () => last(items()),
    next,
    prev: previous,
    all: () => items().filter((el) => !skip?.(el)),
    slice,
  }
}

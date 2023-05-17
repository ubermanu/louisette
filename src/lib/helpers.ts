/** Generates a small random HTML id */
export function generateId() {
  return `l-${Math.random().toString(36).substring(2, 12)}`
}

export type DelegateEventMap = {
  [event: string]: {
    [selector: string]: (e?: Event | any) => void
  }
}

/**
 * Attach event listeners to a node, delegating to a selector.
 *
 * Example:
 *
 * ```ts
 * const unsubscribe = delegate(node, {
 *   click: {
 *     '.button': (event) => console.log(event.target),
 *     '.link': (event) => console.log(event.target),
 *   },
 * })
 * ```
 */
export function delegate(node: HTMLElement, eventsMap: DelegateEventMap) {
  const unsubscribeFns: (() => void)[] = []

  for (const [event, selectors] of Object.entries(eventsMap)) {
    for (const [selector, callback] of Object.entries(selectors)) {
      const handler = (event: Event) => {
        const path = event.composedPath()
        const target = path.find(
          (node) =>
            node instanceof HTMLElement &&
            node.matches &&
            node.matches(selector)
        )
        if (target) {
          callback(event)
        }
      }
      node.addEventListener(event, handler)
      unsubscribeFns.push(() => node.removeEventListener(event, handler))
    }
  }

  return () => {
    unsubscribeFns.forEach((fn) => fn())
  }
}

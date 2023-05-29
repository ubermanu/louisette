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
export function delegateEventListeners(
  node: HTMLElement,
  eventsMap: DelegateEventMap
) {
  const unsubscribeFns: (() => void)[] = []

  for (const [event, selectors] of Object.entries(eventsMap)) {
    for (const [selector, callback] of Object.entries(selectors)) {
      const handler = (event: Event) => {
        const path = event.composedPath()
        const target = path.find(
          (node) => node instanceof HTMLElement && node.matches(selector)
        )
        if (target) {
          const delegateEvent = event as DelegateEvent<Event>
          delegateEvent.delegateTarget = target as HTMLElement
          callback(delegateEvent)
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

export type DelegateEvent<T> = {
  delegateTarget: HTMLElement
} & T

// TODO: fix event type in handler
type DelegateEventMap = {
  [event: string]: {
    [selector: string]: (event: DelegateEvent<unknown> | any) => void
  }
}

export interface CollapsibleConfig {
  open: boolean
}

export function createCollapsible(config?: CollapsibleConfig) {
  let open = $state(config?.open ?? false)

  const baseId = crypto.randomUUID()

  let trigger = $derived({
    id: `${baseId}-trigger`,
    'aria-controls': `${baseId}-content`,
    'aria-expanded': open,
    onclick: onTriggerClick,
    onkeydown: onTriggerKeyDown,
  })

  let content = $derived({
    id: `${baseId}-content`,
    'aria-hidden': !open,
    inert: !open,
  })

  function onTriggerClick(event: MouseEvent) {
    open = !open
  }

  function onTriggerKeyDown(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      open = !open
    }
  }

  class Collapsible {
    get open() {
      return open
    }
    set open(_open) {
      open = _open
    }
    get trigger() {
      return trigger
    }
    get content() {
      return content
    }
  }

  return new Collapsible()
}

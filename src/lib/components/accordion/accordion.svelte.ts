export interface AccordionConfig {}

export function createAccordion(config?: AccordionConfig) {
  let open = $state<string | null>(null)

  const baseId = crypto.randomUUID()

  let trigger = $derived((key: string) => ({
    id: `${baseId}-trigger-${key}`,
    'aria-controls': `${baseId}-content-${key}`,
    'aria-expanded': open === key,
    onclick: onTriggerClick.bind({ key }),
    onkeydown: onTriggerKeydown.bind({ key }),
  }))

  let content = $derived((key: string) => ({
    id: `${baseId}-content-${key}`,
    'aria-hidden': open !== key,
    'aria-labelled-by': `${baseId}-trigger-${key}`,
    inert: open !== key,
  }))

  function onTriggerClick(this: { key: string }, event: MouseEvent) {
    event.preventDefault()
    open = open === this.key ? null : this.key
  }

  function onTriggerKeydown(this: { key: string }, event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      open = open === this.key ? null : this.key
    }
  }

  class Accordion {
    get open() {
      return open
    }
    get trigger() {
      return trigger
    }
    get content() {
      return content
    }
  }

  return new Accordion()
}

import { TokenList } from '$lib/util/TokenList.svelte.js'

export interface AccordionConfig {}

export function createAccordion(config?: AccordionConfig) {
  let openList = new TokenList()

  const baseId = crypto.randomUUID()

  let trigger = $derived((key: string) => ({
    id: `${baseId}-trigger-${key}`,
    'aria-controls': `${baseId}-content-${key}`,
    'aria-expanded': openList.contains(key),
    onclick: onTriggerClick.bind({ key }),
    onkeydown: onTriggerKeyDown.bind({ key }),
  }))

  let content = $derived((key: string) => ({
    id: `${baseId}-content-${key}`,
    'aria-hidden': !openList.contains(key),
    inert: !openList.contains(key),
  }))

  function onTriggerClick(this: { key: string }, event: MouseEvent) {
    event.preventDefault()
    openList.toggle(this.key)
  }

  function onTriggerKeyDown(this: { key: string }, event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      openList.toggle(this.key)
    }
  }

  class Accordion {
    get openList() {
      return openList
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

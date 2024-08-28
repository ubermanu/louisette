import traveller from '$lib/util/traveller.js'

type Orientation = 'vertical' | 'horizontal'

export interface ListboxConfig {
  selection: string[]
  orientation: Orientation
}

/**
 * A listbox is a focusable list that handles its internal navigation. Options
 * can be selected or disabled.
 */
export function createListbox(config: ListboxConfig) {
  let selection = $state<string[]>(config?.selection ?? [])
  let activeDescendant = $state<string | null>(null)
  let orientation = $state<Orientation>(config?.orientation ?? 'vertical')

  const baseId = crypto.randomUUID()
  const optionId = (key: string) => `${baseId}-option-${key}`

  const list = $derived({
    'aria-activedescendant': activeDescendant
      ? optionId(activeDescendant)
      : null,
    'aria-orientation': orientation !== 'horizontal' ? orientation : null,
    tabindex: 0,
    onfocusin: onListboxFocusin,
    onkeydown: onListboxKeydown,
  })

  const option = $derived((key: string | number) => ({
    id: optionId(key.toString()),
    role: 'option',
    'aria-selected': selection.includes(key.toString()),
  }))

  /** Set the element as active descendant. If `null`, nothing is focused. */
  function activate(element: HTMLElement | Element | null) {
    activeDescendant =
      element?.id.substring(baseId.length + '-option-'.length) ?? null
  }

  /**
   * Set the focus on the first element if selection is empty, otherwise on the
   * selection.
   */
  function onListboxFocusin(event: FocusEvent) {
    const listboxElement = event.target as HTMLElement

    if (selection.length > 0) {
      activate(document.getElementById(optionId(selection[0])))
    }

    if (!activeDescendant) {
      activate(listboxElement.querySelector(`[id^="${baseId}-option-"]`))
    }
  }

  /** Handle the listbox navigation. */
  function onListboxKeydown(event: KeyboardEvent) {
    if (!activeDescendant) {
      // No active descendant found, this might have been executed through script.
      return
    }

    if (event.key === ' ') {
      event.preventDefault()
      selection = [activeDescendant]
      console.log(selection)
      return
    }

    const listboxElement = event.target as Element

    const options = traveller(listboxElement, `[id^="${baseId}-option-"]`)

    const active = document.getElementById(optionId(activeDescendant))

    if (
      (event.key === 'ArrowDown' && orientation === 'vertical') ||
      (event.key === 'ArrowRight' && orientation === 'horizontal')
    ) {
      event.preventDefault()
      const next = options.next(active)
      if (next) {
        activate(next)
      }
    }

    if (
      (event.key === 'ArrowUp' && orientation === 'vertical') ||
      (event.key === 'ArrowLeft' && orientation === 'horizontal')
    ) {
      event.preventDefault()
      const prev = options.prev(active)
      if (prev) {
        activate(prev)
      }
    }

    if (event.key === 'Home') {
      event.preventDefault()
      const first = options.first()
      if (first) {
        activate(first)
      }
    }

    if (event.key === 'End') {
      event.preventDefault()
      const last = options.last()
      if (last) {
        activate(last)
      }
    }
  }

  class Listbox {
    get activeDescendant() {
      return activeDescendant
    }
    get selection() {
      return selection
    }
    /** The main container of the listbox. */
    get list() {
      return list
    }
    get option() {
      return option
    }
  }

  return new Listbox()
}

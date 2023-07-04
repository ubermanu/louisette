import { createListbox } from '$lib/components/Listbox/listbox.js'
import { onBrowserMount } from '$lib/helpers/environment.js'
import { traveller } from '$lib/helpers/traveller.js'
import { generateId } from '$lib/helpers/uuid.js'
import { derived, get, readable, readonly, writable } from 'svelte/store'
import type { Combobox, ComboboxConfig } from './combobox.types.js'

export const createCombobox = (config?: ComboboxConfig): Combobox => {
  const { disabled, selected, autocomplete } = { ...config }

  const baseId = generateId()
  const inputId = `${baseId}-input`
  const buttonId = `${baseId}-button`
  const listboxId = `${baseId}-listbox`

  const comboboxAttrs = readable({
    'data-combobox': baseId,
  })

  const listbox = createListbox({
    selected,
    disabled,
    multiple: false,
    orientation: 'vertical',
  })

  const opened$ = writable(false)

  // TODO: Focus the first option (or the last selected option) when opening the listbox
  const openListbox = () => {
    if (get(opened$)) return
    opened$.set(true)
    document.addEventListener('click', onDocumentClick, true)
  }

  /** Close the listbox and focus the button */
  const closeListbox = () => {
    if (!get(opened$)) return
    opened$.set(false)
    inputNode?.focus()
    document.removeEventListener('click', onDocumentClick, true)
    // Remove text selection in the input and move the cursor to the end
    inputNode?.setSelectionRange(-1, -1)
  }

  const toggleListbox = () => {
    if (get(opened$)) closeListbox()
    else openListbox()
  }

  const inputAttrs = derived(
    [opened$, listbox.listboxAttrs],
    ([opened, listboxAttrs]) => ({
      id: inputId,
      role: 'combobox',
      'aria-autocomplete': autocomplete ? 'both' : 'list',
      'aria-expanded': opened,
      'aria-controls': listboxId,
      'aria-activedescendant': listboxAttrs['aria-activedescendant'],
    })
  )

  const listboxAttrs = derived(
    [opened$, listbox.listboxAttrs],
    ([opened, origAttributes]) => ({
      ...origAttributes,
      id: listboxId,
      tabIndex: undefined,
      'aria-activeDescendant': undefined,
      'aria-hidden': !opened,
      inert: opened ? undefined : '',
    })
  )

  // When the user clicks outside the component, close the listbox
  const onDocumentClick = (event: MouseEvent) => {
    if (
      !(
        inputNode!.contains(event.target as Node) ||
        buttonNode!.contains(event.target as Node) ||
        listboxNode!.contains(event.target as Node)
      )
    ) {
      closeListbox()
    }
  }

  // TODO: Insane duplicate code from the listbox, refactor
  const onInputKeyDown = (event: KeyboardEvent) => {
    const $activeDescendant = get(listbox.activeDescendant)
    const $disabled = get(listbox.disabled)
    const $opened = get(opened$)

    const options = traveller(listboxNode!, '[data-listbox-option]', (el) => {
      return $disabled.includes(el.dataset.listboxOption!)
    })

    let target =
      options
        .all()
        .find((el) => el.dataset.listboxOption === $activeDescendant) || null

    if (['ArrowUp', 'ArrowDown'].includes(event.key) && !$opened) {
      event.preventDefault()
      openListbox()

      // TODO: Set activeDescendant to the first selected option (if none)
      // TODO: Set activeDescendant to the last selected option (if ArrowUp)
      if (!target) {
        listbox.activeDescendant.set(options.first()?.dataset.listboxOption!)
      }
      return
    }

    if (event.key === 'Escape' && $opened) {
      event.preventDefault()
      closeListbox()
      return
    }

    if (event.key === 'Escape' && !$opened) {
      // TODO: Clear the input
    }

    if (['Enter', 'Tab'].includes(event.key) && $opened) {
      event.preventDefault()
      listbox.select($activeDescendant)
      return
    }

    if (!target) {
      console.warn('There are no options in this listbox')
      return
    }

    if ($opened) {
      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault()
          const next = options.next(target)
          if (next) {
            listbox.activeDescendant.set(next.dataset.listboxOption!)
          }
          break
        }

        case 'ArrowUp': {
          event.preventDefault()
          const previous = options.previous(target)
          if (previous) {
            listbox.activeDescendant.set(previous.dataset.listboxOption!)
          }
          break
        }

        case 'Home': {
          event.preventDefault()
          const first = options.first()
          if (first) {
            listbox.activeDescendant.set(first.dataset.listboxOption!)
          }
          break
        }

        case 'End': {
          event.preventDefault()
          const last = options.last()
          if (last) {
            listbox.activeDescendant.set(last.dataset.listboxOption!)
          }
          break
        }
      }
    }
  }

  const onInputInput = (event: InputEvent) => {
    if (event.inputType !== 'insertText') {
      return
    }

    const text = inputNode?.value.trim() ?? ''

    if (text.length === 0) {
      listbox.activeDescendant.set('')
      closeListbox()
      return
    }

    // Set the activeDescendant to the first option that starts with the input value
    const options = traveller(listboxNode!, '[data-listbox-option]')

    const firstMatch = options.all().find((el) => {
      return el.textContent?.toLowerCase().startsWith(text.toLowerCase())
    })

    if (firstMatch) {
      openListbox()
      const match = firstMatch.dataset.listboxOption!
      listbox.activeDescendant.set(match)

      if (autocomplete && inputNode) {
        // Set selection to the rest of the matched text
        inputNode.value = match
        inputNode.setSelectionRange(
          text.length,
          match.length
        )
      }
    } else {
      closeListbox()
    }
  }

  const onButtonClick = () => {
    toggleListbox()
  }

  const buttonAttrs = derived([opened$], ([opened]) => ({
    tabindex: '-1',
    'aria-expanded': opened,
    'aria-controls': listboxId,
    'data-combobox-button': buttonId,
  }))

  // Remove the "aria-selected" attribute from the option
  const optionAttrs = derived(listbox.optionAttrs, ($optionAttrs) => {
    return (option: string) => {
      const { ['aria-selected']: _, ...attrs } = $optionAttrs(option)
      return attrs
    }
  })

  let listboxNode: HTMLElement | null = null
  let buttonNode: HTMLElement | null = null
  let inputNode: HTMLInputElement | null = null

  onBrowserMount(() => {
    inputNode = document.getElementById(inputId) as HTMLInputElement | null

    if (!inputNode) {
      throw new Error('Could not find the input for the combobox')
    }

    buttonNode = document.querySelector(`[data-combobox-button="${buttonId}"]`)

    if (!buttonNode) {
      throw new Error('Could not find the button for the combobox')
    }

    listboxNode = document.getElementById(listboxId)

    if (!listboxNode) {
      throw new Error('Could not find the listbox for the combobox')
    }

    // TODO: delegate event listeners for input + button
    buttonNode.addEventListener('click', onButtonClick)
    inputNode.addEventListener('input', onInputInput)
    inputNode.addEventListener('keydown', onInputKeyDown)

    const unsubscribe = listbox.selected.subscribe((selected) => {
      // Set the input value to the selected option
      if (inputNode) {
        inputNode.value = selected[0] || ''
      }

      // Close the listbox when the user (un)selects an option
      closeListbox()
    })

    return () => {
      buttonNode?.removeEventListener('click', onButtonClick)
      inputNode?.removeEventListener('input', onInputInput)
      inputNode?.removeEventListener('keydown', onInputKeyDown)
      document.removeEventListener('click', onDocumentClick, true)
      unsubscribe()
    }
  })

  return {
    opened: readonly(opened$),
    selected: listbox.selected,
    disabled: listbox.disabled,
    activeDescendant: listbox.activeDescendant,
    comboboxAttrs,
    inputAttrs,
    buttonAttrs,
    listboxAttrs,
    optionAttrs,
    select: listbox.select,
    unselect: listbox.unselect,
    toggle: listbox.toggle,
  }
}

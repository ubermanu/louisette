import { createListbox } from '$lib/components/Listbox/listbox.js'
import type { DelegateEvent } from '$lib/helpers/events.js'
import { delegateEventListeners } from '$lib/helpers/events.js'
import { traveller } from '$lib/helpers/traveller.js'
import { generateId } from '$lib/helpers/uuid.js'
import type { Action } from 'svelte/action'
import { derived, get, readonly, writable } from 'svelte/store'
import type { Combobox, ComboboxConfig } from './combobox.types.js'

export const createCombobox = (config?: ComboboxConfig): Combobox => {
  const { disabled, selected, autocomplete } = { ...config }

  const baseId = generateId()
  const inputId = `${baseId}-input`
  const listboxId = `${baseId}-listbox`

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
    ;(inputNode as HTMLInputElement | null)?.setSelectionRange(-1, -1)
  }

  const toggleListbox = () => {
    if (get(opened$)) closeListbox()
    else openListbox()
  }

  const inputAttrs = derived([opened$], ([opened]) => ({
    id: inputId,
    role: 'combobox',
    'aria-autocomplete': autocomplete ? 'both' : 'list',
    'aria-expanded': opened,
    'aria-controls': listboxId,
  }))

  const listboxAttrs = derived(
    [opened$, listbox.listboxAttrs],
    ([opened, origAttributes]) => ({
      ...origAttributes,
      id: listboxId,
      tabIndex: undefined,
      'aria-hidden': !opened,
      inert: opened ? undefined : '',
    })
  )

  // When the user clicks outside the component, close the listbox
  const onDocumentClick = (event: MouseEvent) => {
    if (
      !(
        inputNode?.contains(event.target as Node) ||
        buttonNode?.contains(event.target as Node) ||
        listboxNode?.contains(event.target as Node)
      )
    ) {
      closeListbox()
    }
  }

  let inputNode: HTMLElement | null = null

  const useInput: Action = (node) => {
    inputNode = node

    // TODO: Insane duplicate code from the listbox, refactor
    const onInputKeyDown = (event: KeyboardEvent) => {
      const $activeDescendant = get(listbox.activeDescendant)
      const $disabled = get(listbox.disabled)
      const $opened = get(opened$)

      if (!listboxNode) {
        console.warn('There is no listbox associated with this select')
        return
      }

      const nodes = traveller(listboxNode, '[data-listbox-option]', (el) => {
        return $disabled.includes(el.dataset.listboxOption!)
      })

      let target =
        nodes
          .all()
          .find((el) => el.dataset.listboxOption === $activeDescendant) || null

      if (['ArrowUp', 'ArrowDown'].includes(event.key) && !$opened) {
        event.preventDefault()
        openListbox()

        // TODO: Set activeDescendant to the first selected option (if none)
        // TODO: Set activeDescendant to the last selected option (if ArrowUp)
        if (!target) {
          listbox.activeDescendant.set(nodes.first()?.dataset.listboxOption!)
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
            const next = nodes.next(target)
            if (next) {
              listbox.activeDescendant.set(next.dataset.listboxOption!)
            }
            break
          }

          case 'ArrowUp': {
            event.preventDefault()
            const previous = nodes.previous(target)
            if (previous) {
              listbox.activeDescendant.set(previous.dataset.listboxOption!)
            }
            break
          }

          case 'Home': {
            event.preventDefault()
            const first = nodes.first()
            if (first) {
              listbox.activeDescendant.set(first.dataset.listboxOption!)
            }
            break
          }

          case 'End': {
            event.preventDefault()
            const last = nodes.last()
            if (last) {
              listbox.activeDescendant.set(last.dataset.listboxOption!)
            }
            break
          }
        }
      }
    }

    const onInputInput = (event: InputEvent) => {
      if (event.inputType === 'deleteContentBackward') {
        return
      }

      const text = (inputNode as HTMLInputElement).value.trim()

      if (text.length === 0) {
        listbox.activeDescendant.set('')
        closeListbox()
        return
      }

      // Set the activeDescendant to the first option that starts with the input value
      const nodes = traveller(listboxNode!, '[data-listbox-option]')

      const firstMatch = nodes.all().find((el) => {
        return el.textContent?.toLowerCase().startsWith(text.toLowerCase())
      })

      if (firstMatch) {
        openListbox()
        const match = firstMatch.dataset.listboxOption!
        listbox.activeDescendant.set(match)

        if (autocomplete) {
          // Set selection to the rest of the matched text
          ;(inputNode as HTMLInputElement).value = match
          ;(inputNode as HTMLInputElement).setSelectionRange(
            text.length,
            match.length
          )
        }
      } else {
        closeListbox()
      }
    }

    node.addEventListener('keydown', onInputKeyDown)
    // @ts-ignore
    node.addEventListener('input', onInputInput)

    return {
      destroy() {
        node.removeEventListener('keydown', onInputKeyDown)
        // @ts-ignore
        node.removeEventListener('input', onInputInput)
        document.removeEventListener('click', onDocumentClick, true)
        inputNode = null
      },
    }
  }

  let listboxNode: HTMLElement | null = null

  // TODO: Kind of duplicate of what the listbox action does
  const useListbox: Action = (node) => {
    listboxNode = node

    // TODO: Subscribe outside of action
    const unsubscribe = listbox.selected.subscribe((selected) => {
      // Set the input value to the selected option
      ;(inputNode as HTMLInputElement).value = selected[0] || ''

      // Close the listbox when the user (un)selects an option
      closeListbox()
    })

    // TODO: Huge copy pasta from the listbox action, refactor
    const removeListeners = delegateEventListeners(node, {
      click: {
        '[data-listbox-option]': (event: DelegateEvent<MouseEvent>) => {
          listbox.select(event.delegateTarget.dataset.listboxOption!)
          listbox.activeDescendant.set(
            event.delegateTarget.dataset.listboxOption!
          )
        },
      },
    })

    return {
      destroy() {
        removeListeners()
        unsubscribe()
        listboxNode = null
      },
    }
  }

  let buttonNode: HTMLElement | null = null

  const useButton: Action = (node) => {
    buttonNode = node

    const onButtonClick = () => {
      toggleListbox()
    }

    node.addEventListener('click', onButtonClick)

    return {
      destroy() {
        node.removeEventListener('click', onButtonClick)
        buttonNode = null
      },
    }
  }

  const buttonAttrs = derived([opened$], ([opened]) => ({
    tabindex: '-1',
    'aria-expanded': opened,
    'aria-controls': listboxId,
  }))

  return {
    opened: readonly(opened$),
    selected: listbox.selected,
    disabled: listbox.disabled,
    activeDescendant: listbox.activeDescendant,
    input: useInput,
    inputAttrs,
    button: useButton,
    buttonAttrs,
    listbox: useListbox,
    listboxAttrs,
    optionAttrs: listbox.optionAttrs,
    select: listbox.select,
    unselect: listbox.unselect,
    toggle: listbox.toggle,
  }
}

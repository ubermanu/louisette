import { createListbox } from '$lib/components/Listbox/listbox.js'
import { mergeActions } from '$lib/helpers/actions.js'
import type { DelegateEvent } from '$lib/helpers/events.js'
import { delegateEventListeners } from '$lib/helpers/events.js'
import { traveller } from '$lib/helpers/traveller.js'
import { generateId } from '$lib/helpers/uuid.js'
import { useTypeAhead } from '$lib/interactions/TypeAhead/typeAhead.js'
import type { Action } from 'svelte/action'
import { derived, get, readonly, writable } from 'svelte/store'
import type { Select, SelectConfig } from './select.types.js'

export const createSelect = (config?: SelectConfig): Select => {
  const { multiple, disabled, selected } = { ...config }

  const baseId = generateId()
  const buttonId = `${baseId}-button`
  const listboxId = `${baseId}-listbox`

  const listbox = createListbox({
    selected,
    disabled,
    multiple,
    orientation: 'vertical',
  })

  const opened$ = writable(false)

  // TODO: Focus the first option (or the last selected option) when opening the listbox
  const openListbox = () => {
    opened$.set(true)
  }

  /** Close the listbox and focus the button */
  const closeListbox = () => {
    opened$.set(false)
    buttonNode?.focus()
  }

  const toggleListbox = () => {
    if (get(opened$)) closeListbox()
    else openListbox()
  }

  const buttonAttrs = derived([opened$], ([opened]) => ({
    id: buttonId,
    role: 'combobox',
    'aria-haspopup': 'listbox',
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

  const selectedLabel = derived(listbox.selected, (selected) => {
    if (selected.length === 0) {
      return ''
    }
    if (selected.length === 1) {
      // Get the text content of the selected option (as label)
      // This infers that the option is a text node, might be true in general
      return (
        listboxNode?.querySelector(`[data-listbox-option="${selected[0]}"]`)
          ?.textContent || selected[0]
      )
    }
    return `${selected.length} selected`
  })

  let buttonNode: HTMLElement | null = null

  // TODO: Merge this action with typeAhead later
  const useButton: Action = (node) => {
    buttonNode = node

    // TODO: Insane duplicate code from the listbox, refactor
    const onButtonKeyDown = (event: KeyboardEvent) => {
      const $multiple = multiple
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

      if (['Enter', ' ', 'ArrowDown'].includes(event.key) && !$opened) {
        event.preventDefault()
        openListbox()

        // TODO: Set activeDescendant to the first selected option (if none)
        if (!target) {
          listbox.activeDescendant.set(nodes.first()?.dataset.listboxOption!)
        }
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        closeListbox()
        return
      }

      if (['Enter', ' ', 'Tab'].includes(event.key) && $opened) {
        event.preventDefault()

        if ($multiple) {
          if (event.shiftKey) {
            // TODO: Select all options between lastSelected and key
          } else {
            listbox.toggle($activeDescendant)
          }
        } else {
          listbox.select($activeDescendant)
        }
        return
      }

      if (!target) {
        console.warn('There are no options in this listbox')
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        const next = nodes.next(target)

        if (next) {
          listbox.activeDescendant.set(next.dataset.listboxOption!)

          if (event.shiftKey && $multiple) {
            listbox.select(next.dataset.listboxOption!)
          }
        }
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        const previous = nodes.previous(target)

        if (previous) {
          listbox.activeDescendant.set(previous.dataset.listboxOption!)

          if (event.shiftKey && $multiple) {
            listbox.select(previous.dataset.listboxOption!)
          }
        }
      }

      if (event.key === 'Home') {
        event.preventDefault()
        const first = nodes.first()

        if (first) {
          // Selects the focused option and all options up to the first option.
          if ($multiple && event.shiftKey && event.ctrlKey) {
            // TODO: Implement
          } else {
            listbox.activeDescendant.set(first.dataset.listboxOption!)
          }
        }
      }

      if (event.key === 'End') {
        event.preventDefault()
        const last = nodes.last()

        if (last) {
          // Selects the focused option and all options up to the last option.
          if ($multiple && event.shiftKey && event.ctrlKey) {
            // TODO: Implement
          } else {
            listbox.activeDescendant.set(last.dataset.listboxOption!)
          }
        }
      }

      if ($multiple && event.key === 'a' && event.ctrlKey) {
        event.preventDefault()
        // TODO: Implement
      }

      // TODO: Implement typeahead (from interactions)
    }

    const onButtonClick = () => {
      toggleListbox()
    }

    const onButtonBlur = () => {
      closeListbox()
    }

    node.addEventListener('keydown', onButtonKeyDown)
    node.addEventListener('click', onButtonClick)
    // node.addEventListener('blur', onButtonBlur)

    return {
      destroy() {
        node.removeEventListener('keydown', onButtonKeyDown)
        node.removeEventListener('click', onButtonClick)
        // node.removeEventListener('blur', onButtonBlur)
        buttonNode = null
      },
    }
  }

  let listboxNode: HTMLElement | null = null

  // TODO: Kind of duplicate of what the listbox action does
  const useListbox: Action = (node) => {
    listboxNode = node

    // TODO: Subscribe outside of action
    const unsubscribe = listbox.selected.subscribe((selected) => {
      // if (selected.length === 0) return
      // const key = selected[selected.length - 1]
      // const option = document.getElementById(key)
      // if (option) option.scrollIntoView({ block: 'nearest' })

      // Close the listbox when the user (un)selects an option (if not multiple)
      if (!multiple) {
        closeListbox()
      }
    })

    // TODO: Huge copy pasta from the listbox action, refactor
    const removeListeners = delegateEventListeners(node, {
      click: {
        '[data-listbox-option]': (event: DelegateEvent<MouseEvent>) => {
          // TODO: The multiple value check should come from the listbox
          // TODO: If shift is pressed, select all options between lastSelected and key
          if (multiple) {
            listbox.toggle(event.delegateTarget.dataset.listboxOption!)
          } else {
            listbox.select(event.delegateTarget.dataset.listboxOption!)
          }
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

  const lookupListboxOption = (text: string): HTMLElement | null => {
    const options = Array.from(
      listboxNode?.querySelectorAll('[data-listbox-option]') || []
    ) as HTMLElement[]

    return (
      options.find((option) => {
        if (!option.textContent) return false
        return option.textContent.toLowerCase().startsWith(text.toLowerCase())
      }) || null
    )
  }

  // TODO: Test that
  const typeahead = useTypeAhead({
    onTypeAheadStart: () => {
      openListbox()
    },
    onTypeAhead: (text) => {
      const option = lookupListboxOption(text)
      if (option) {
        listbox.activeDescendant.set(option.dataset.listboxOption!)
      }
    },
  })

  return {
    opened: readonly(opened$),
    selected: listbox.selected,
    disabled: listbox.disabled,
    selectedLabel,
    activeDescendant: listbox.activeDescendant,
    button: mergeActions(useButton, typeahead.typeAhead),
    buttonAttrs,
    listbox: useListbox,
    listboxAttrs,
    optionAttrs: listbox.optionAttrs,
    select: listbox.select,
    unselect: listbox.unselect,
    toggle: listbox.toggle,
    selectAll: listbox.selectAll,
    unselectAll: listbox.unselectAll,
  } as Select
}

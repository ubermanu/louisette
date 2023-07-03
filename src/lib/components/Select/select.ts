import { createListbox } from '$lib/components/Listbox/listbox.js'
import { onBrowserMount } from '$lib/helpers/environment.js'
import { traveller } from '$lib/helpers/traveller.js'
import { generateId } from '$lib/helpers/uuid.js'
import { useTypeAhead } from '$lib/interactions/TypeAhead/typeAhead.js'
import { derived, get, readable, readonly, writable } from 'svelte/store'
import type { Select, SelectConfig } from './select.types.js'

export const createSelect = (config?: SelectConfig): Select => {
  const { multiple, disabled, selected } = { ...config }

  const baseId = generateId()
  const buttonId = `${baseId}-button`
  const listboxId = `${baseId}-listbox`

  const selectAttrs = readable({
    'data-select': baseId,
  })

  const listbox = createListbox({
    selected,
    disabled,
    multiple,
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
    buttonNode?.focus()
    document.removeEventListener('click', onDocumentClick, true)
  }

  const toggleListbox = () => {
    if (get(opened$)) closeListbox()
    else openListbox()
  }

  const buttonAttrs = derived(
    [opened$, listbox.listboxAttrs],
    ([opened, listboxAttrs]) => ({
      role: 'combobox',
      'aria-haspopup': 'listbox',
      'aria-expanded': opened,
      'aria-controls': listboxId,
      'aria-activedescendant': listboxAttrs['aria-activedescendant'],
      'data-select-button': buttonId,
    })
  )

  const listboxAttrs = derived(
    [opened$, listbox.listboxAttrs],
    ([opened, origAttributes]) => ({
      ...origAttributes,
      id: listboxId,
      tabIndex: undefined,
      'aria-hidden': !opened,
      inert: opened ? undefined : '',
      'aria-activedescendant': undefined,
    })
  )

  const selectedLabel = derived(listbox.selected, (selected) => {
    if (selected.length === 0) {
      return ''
    }
    if (selected.length === 1) {
      // Get the text content of the selected option (as label)
      // This infers that the option is a text node, might be true in general
      // FIXME: When selected is defined from defaults, the node does not exist yet
      return (
        listboxNode
          ?.querySelector(`[data-listbox-option="${selected[0]}"]`)
          ?.textContent?.trim() || selected[0]
      )
    }
    return `${selected.length} selected`
  })

  // When the user clicks outside the component, close the listbox
  const onDocumentClick = (event: MouseEvent) => {
    if (
      !(
        buttonNode?.contains(event.target as Node) ||
        listboxNode?.contains(event.target as Node)
      )
    ) {
      closeListbox()
    }
  }

  const onButtonKeyDown = (event: KeyboardEvent) => {
    const $multiple = multiple
    const $activeDescendant = get(listbox.activeDescendant)
    const $disabled = get(listbox.disabled)
    const $opened = get(opened$)

    const nodes = traveller(listboxNode!, '[data-listbox-option]', (el) => {
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
      event.stopPropagation()

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

  let buttonNode: HTMLElement | null = null
  let listboxNode: HTMLElement | null = null

  onBrowserMount(() => {
    buttonNode = document.querySelector(`[data-select-button="${buttonId}"]`)

    if (!buttonNode) {
      throw new Error('Could not find the button node for the select')
    }

    listboxNode = document.getElementById(listboxId)

    if (!listboxNode) {
      throw new Error('Could not find the listbox node for the select')
    }

    // TODO: Insane duplicate code from the listbox, refactor
    buttonNode.addEventListener('keydown', onButtonKeyDown)
    buttonNode.addEventListener('click', onButtonClick)

    // Close the listbox when the user (un)selects an option (if not multiple)
    const unsubscribe = listbox.selected.subscribe(() => {
      if (!multiple) {
        closeListbox()
      }
    })

    // Attach typeahead to the button node
    const typeaheadAction = typeahead.typeAhead(buttonNode)

    return () => {
      buttonNode?.removeEventListener('keydown', onButtonKeyDown)
      buttonNode?.removeEventListener('click', onButtonClick)
      document.removeEventListener('click', onDocumentClick, true)
      unsubscribe()
      typeaheadAction?.destroy?.()
    }
  })

  return {
    opened: readonly(opened$),
    selected: listbox.selected,
    disabled: listbox.disabled,
    selectedLabel,
    activeDescendant: listbox.activeDescendant,
    selectAttrs,
    buttonAttrs,
    listboxAttrs,
    optionAttrs: listbox.optionAttrs,
    select: listbox.select,
    unselect: listbox.unselect,
    toggle: listbox.toggle,
    selectAll: listbox.selectAll,
    unselectAll: listbox.unselectAll,
  }
}

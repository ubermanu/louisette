import { createListbox } from '$lib/components/Listbox/listbox.js'
import { mergeActions } from '$lib/helpers/actions.js'
import { delegateEventListeners } from '$lib/helpers/events.js'
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

    const onButtonKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        openListbox()
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        toggleListbox()
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        closeListbox()
      }
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

  const useListbox: Action = (node) => {
    listboxNode = node

    const unsubscribe = listbox.selected.subscribe((selected) => {
      // if (selected.length === 0) return
      // const key = selected[selected.length - 1]
      // const option = document.getElementById(key)
      // if (option) option.scrollIntoView({ block: 'nearest' })

      // Close the listbox when the user (un)selects an option
      closeListbox()
    })

    const onOptionKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeListbox()
      }
    }

    const removeListeners = delegateEventListeners(node, {
      keydown: {
        '[data-listbox-option]': onOptionKeyDown,
      },
    })

    return {
      destroy() {
        unsubscribe()
        removeListeners()
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
        listbox.select(option.dataset.listboxOption!)
      }
    },
  })

  return {
    opened: readonly(opened$),
    selected: listbox.selected,
    disabled: listbox.disabled,
    selectedLabel,
    button: mergeActions(useButton, typeahead.typeAhead),
    buttonAttrs,
    listbox: mergeActions(useListbox, listbox.listbox),
    listboxAttrs,
    optionAttrs: listbox.optionAttrs,
    select: listbox.select,
    unselect: listbox.unselect,
    toggle: listbox.toggle,
    selectAll: listbox.selectAll,
    unselectAll: listbox.unselectAll,
  } as Select
}

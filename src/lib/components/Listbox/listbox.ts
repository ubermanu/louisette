import { delegateEventListeners } from '$lib/helpers.js'
import { traveller } from '$lib/helpers/traveller.js'
import type { Action } from 'svelte/action'
import { derived, get, readonly, writable } from 'svelte/store'

export type ListboxConfig = {
  /** The key of the selected options. */
  selected?: string | string[]

  /** The key of the disabled options. */
  disabled?: string | string[]

  /** If true, the listbox allows multiple selections. */
  multiple?: boolean

  /** The orientation of the listbox. */
  orientation?: 'horizontal' | 'vertical'
}

export type Listbox = ReturnType<typeof createListbox>

export const createListbox = (config?: ListboxConfig) => {
  const { selected, disabled, multiple, orientation } = { ...config }

  const selected$ = writable(
    (selected ? (Array.isArray(selected) ? selected : [selected]) : []).slice(
      0,
      multiple ? undefined : 1
    )
  )
  const disabled$ = writable(
    disabled ? (Array.isArray(disabled) ? disabled : [disabled]) : []
  )
  const multiple$ = writable(multiple || false)
  const orientation$ = writable(orientation || 'vertical')

  const listboxAttrs = derived(
    [multiple$, orientation$],
    ([multiple, orientation]) => ({
      role: 'listbox',
      'aria-multiselectable': multiple,
      'aria-orientation': orientation,
    })
  )

  // The key of the first rendered option (not disabled)
  let firstOptionKey: string | undefined

  const optionAttrs = derived(
    [selected$, disabled$, multiple$],
    ([selected, disabled, multiple]) => {
      // If disabled, should not be focusable
      // If selected, should be focusable (if single select)
      // If selected and 1st enabled option, should be focusable (if multiple select)
      // If not selected and 1st enabled option, should be focusable
      const isFocusable = (key: string) => {
        if (disabled.includes(key)) return false
        if (!multiple && selected.length > 0) return selected.includes(key)
        if (multiple && selected.length > 0) return selected[0] === key
        return firstOptionKey === key
      }

      return (key: string) => {
        if (!firstOptionKey && !disabled.includes(key)) {
          firstOptionKey = key
        }

        return {
          role: 'option',
          [multiple ? 'aria-checked' : 'aria-selected']: selected.includes(key),
          'aria-disabled': disabled.includes(key),
          tabIndex: isFocusable(key) ? 0 : -1,
          'data-listbox-option': key,
        }
      }
    }
  )

  const groupAttrs = derived([selected$, disabled$], ([selected, disabled]) => {
    return (key: string) => ({
      role: 'group',
      'data-listbox-group': key,
    })
  })

  const select = (key: string) => {
    if (!key) return

    const $disabled = get(disabled$)
    if ($disabled.includes(key)) return

    const $multiple = get(multiple$)

    if ($multiple) {
      selected$.update((selected) => [...selected, key])
    } else {
      selected$.set([key])
    }
  }

  const unselect = (key: string) => {
    if (!key) return
    const $disabled = get(disabled$)
    if ($disabled.includes(key)) return
    selected$.update((selected) => selected.filter((item) => item !== key))
  }

  const toggle = (key: string) => {
    if (!key) return
    const $selected = get(selected$)
    if ($selected.includes(key)) {
      unselect(key)
    } else {
      select(key)
    }
  }

  const selectAll = () => {
    const $multiple = get(multiple$)
    const $disabled = get(disabled$)
    if ($multiple) {
      selected$.set(
        Array.from(rootNode?.querySelectorAll(`[data-listbox-option]`) ?? [])
          .map(
            (option) => (option as HTMLElement).dataset.listboxOption as string
          )
          .filter((key) => !$disabled.includes(key))
      )
    }
  }

  // TODO: If disabled, should not be able to unselect
  const unselectAll = () => {
    selected$.set([])
  }

  let rootNode: HTMLElement | undefined
  let lastSelectedKey: string | undefined

  const onOptionKeyDown = (event: KeyboardEvent) => {
    const key = (event.target as HTMLElement).dataset.listboxOption as string

    const $multiple = get(multiple$),
      $orientation = get(orientation$)

    if (event.key === ' ') {
      event.preventDefault()

      if ($multiple && event.shiftKey) {
        // TODO: Select all options between lastSelected and key
      } else {
        toggle(key)
      }
    }

    if (!rootNode) {
      console.warn('The listbox root node is not defined.')
      return
    }

    const $disabled = get(disabled$)

    const nodes = traveller(rootNode, '[data-listbox--option]', (el) => {
      return $disabled.includes(el.dataset.accordionTrigger as string)
    })

    if (
      (event.key === 'ArrowDown' && $orientation === 'vertical') ||
      (event.key === 'ArrowRight' && $orientation === 'horizontal')
    ) {
      event.preventDefault()
      const next = nodes.next(event.target as HTMLElement)
      next?.focus()

      if (next && event.shiftKey && $multiple) {
        select(next.dataset.listboxOption as string)
      }
    }

    if (
      (event.key === 'ArrowUp' && $orientation === 'vertical') ||
      (event.key === 'ArrowLeft' && $orientation === 'horizontal')
    ) {
      event.preventDefault()
      const previous = nodes.previous(event.target as HTMLElement)
      previous?.focus()

      if (previous && event.shiftKey && $multiple) {
        select(previous.dataset.listboxOption as string)
      }
    }

    if (event.key === 'Home') {
      event.preventDefault()
      const first = nodes.first()

      // Selects the focused option and all options up to the first option.
      if ($multiple && event.shiftKey && event.ctrlKey) {
        // TODO: Implement
      } else {
        first?.focus()
      }
    }

    if (event.key === 'End') {
      event.preventDefault()
      const last = nodes.last()

      // Selects the focused option and all options up to the last option.
      if ($multiple && event.shiftKey && event.ctrlKey) {
        // TODO: Implement
      } else {
        last?.focus()
      }
    }

    if ($multiple && event.key === 'a' && event.ctrlKey) {
      event.preventDefault()

      const allKeys = nodes
        .all()
        .map(
          (option) => (option as HTMLElement).dataset.listboxOption as string
        )

      if (allKeys.length === get(selected$).length) {
        unselectAll()
      } else {
        selectAll()
      }
    }

    // TODO: Implement typeahead (from interactions)
  }

  const onOptionClick = (event: MouseEvent) => {
    const key = (event.target as HTMLElement).dataset.listboxOption as string
    toggle(key)
  }

  const useListbox: Action = (node) => {
    rootNode = node

    const events = {
      keydown: {
        '[data-listbox-option]': onOptionKeyDown,
      },
      click: {
        '[data-listbox-option]': onOptionClick,
      },
    }

    const removeListeners = delegateEventListeners(node, events)

    // If multiple is false, only one option can be selected
    const unsubscribe = multiple$.subscribe((multiple) => {
      if (!multiple) {
        selected$.update((selected) => selected.slice(0, 1))
      }
    })

    return {
      destroy() {
        removeListeners()
        unsubscribe()
      },
    }
  }

  return {
    selected: readonly(selected$),
    disabled: disabled$,
    listboxAttrs,
    optionAttrs,
    groupAttrs,
    listbox: useListbox,
    select,
    unselect,
    toggle,
    selectAll,
    unselectAll,
  }
}

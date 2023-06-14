import type { DelegateEvent } from '$lib/helpers/events.js'
import { delegateEventListeners } from '$lib/helpers/events.js'
import { traveller } from '$lib/helpers/traveller.js'
import { generateId } from '$lib/helpers/uuid.js'
import type { Action } from 'svelte/action'
import { derived, get, readonly, writable } from 'svelte/store'
import type { Listbox, ListboxConfig } from './listbox.types.js'

export const createListbox = (config?: ListboxConfig): Listbox => {
  const { selected, disabled, multiple, orientation } = { ...config }

  const selected$ = writable(
    (selected || []).slice(0, multiple ? undefined : 1)
  )
  const disabled$ = writable(disabled || [])
  const multiple$ = writable(multiple || false)
  const orientation$ = writable(orientation || 'vertical')
  const activeDescendant$ = writable<string>('')

  const listboxAttrs = derived(
    [multiple$, orientation$, activeDescendant$],
    ([multiple, orientation, activeDescendant]) => ({
      role: 'listbox',
      'aria-multiselectable': multiple,
      'aria-orientation': orientation,
      'aria-activedescendant': activeDescendant
        ? optionId(activeDescendant)
        : undefined,
      tabIndex: 0,
    })
  )

  const baseId = generateId()
  const optionId = (key: string) => `${baseId}-option-${key}`

  const optionAttrs = derived(
    [selected$, disabled$, multiple$],
    ([selected, disabled, multiple]) => {
      return (key: string) => ({
        role: 'option',
        id: optionId(key),
        [multiple ? 'aria-checked' : 'aria-selected']: selected.includes(key),
        'aria-disabled': disabled.includes(key),
        'data-listbox-option': key,
      })
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

  const useListbox: Action = (node) => {
    rootNode = node

    const onListboxKeyDown = (event: KeyboardEvent) => {
      const $multiple = get(multiple$)
      const $orientation = get(orientation$)
      const $activeDescendant = get(activeDescendant$)

      if (event.key === ' ') {
        event.preventDefault()

        if ($multiple && event.shiftKey) {
          // TODO: Select all options between lastSelected and key
        } else {
          toggle($activeDescendant)
        }

        return
      }

      const $disabled = get(disabled$)

      const nodes = traveller(node, '[data-listbox-option]', (el) => {
        return $disabled.includes(el.dataset.listboxOption!)
      })

      let target =
        nodes
          .all()
          .find((el) => el.dataset.listboxOption === $activeDescendant) || null

      if (!target) {
        activeDescendant$.set(nodes.first()?.dataset.listboxOption!)
        return
      }

      if (!target) {
        console.warn('There are no options in this listbox')
        return
      }

      if (
        (event.key === 'ArrowDown' && $orientation === 'vertical') ||
        (event.key === 'ArrowRight' && $orientation === 'horizontal')
      ) {
        event.preventDefault()
        const next = nodes.next(target)

        if (next) {
          activeDescendant$.set(next.dataset.listboxOption!)

          if (event.shiftKey && $multiple) {
            select(next.dataset.listboxOption!)
          }
        }
      }

      if (
        (event.key === 'ArrowUp' && $orientation === 'vertical') ||
        (event.key === 'ArrowLeft' && $orientation === 'horizontal')
      ) {
        event.preventDefault()
        const previous = nodes.previous(target)

        if (previous) {
          activeDescendant$.set(previous.dataset.listboxOption!)

          if (event.shiftKey && $multiple) {
            select(previous.dataset.listboxOption!)
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
            activeDescendant$.set(first.dataset.listboxOption!)
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
            activeDescendant$.set(last.dataset.listboxOption!)
          }
        }
      }

      if ($multiple && event.key === 'a' && event.ctrlKey) {
        event.preventDefault()

        const allKeys = nodes
          .all()
          .map((option) => (option as HTMLElement).dataset.listboxOption!)

        if (allKeys.length === get(selected$).length) {
          unselectAll()
        } else {
          selectAll()
        }
      }

      // TODO: Implement typeahead (from interactions)
    }

    node.addEventListener('keydown', onListboxKeyDown)

    const removeListeners = delegateEventListeners(node, {
      click: {
        '[data-listbox-option]': (event: DelegateEvent<MouseEvent>) => {
          toggle(event.delegateTarget.dataset.listboxOption!)
          activeDescendant$.set(event.delegateTarget.dataset.listboxOption!)
        },
      },
    })

    // If multiple is false, only one option can be selected
    const unsubscribe = multiple$.subscribe((multiple) => {
      if (!multiple) {
        selected$.update((selected) => selected.slice(0, 1))
      }
    })

    return {
      destroy() {
        node.removeEventListener('keydown', onListboxKeyDown)
        removeListeners()
        unsubscribe()
      },
    }
  }

  return {
    selected: readonly(selected$),
    disabled: disabled$,
    activeDescendant: activeDescendant$,
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

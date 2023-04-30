import { generateId } from '$lib/helpers.js'
import { v4 as uuid } from '@lukeed/uuid'
import type { Action } from 'svelte/action'
import { derived, get, writable } from 'svelte/store'

type AccordionConfig = {
  multiple?: boolean
}

interface AccordionItem {
  id: string
  expanded: boolean
  disabled: boolean
  triggerElement?: HTMLElement
}

type AccordionItemConfig = {
  expanded?: boolean
  disabled?: boolean
}

export const createAccordionProvider = (config: AccordionConfig) => {
  const multiple = writable(config?.multiple || false)
  const items = writable<AccordionItem[]>([])

  /** Open an item by id */
  const openItem = (id: string) => {
    const $multiple = get(multiple)
    items.update(($items) => {
      if (!$multiple) {
        return $items.map(($item) => ({
          ...$item,
          expanded: $item.id === id,
        }))
      }
      return $items.map(($item) => ({
        ...$item,
        expanded: $item.id === id ? !$item.expanded : $item.expanded,
      }))
    })
  }

  /** Close an item by id */
  const closeItem = (id: string) => {
    items.update(($items) => {
      return $items.map(($item) => ({
        ...$item,
        expanded: $item.id === id ? false : $item.expanded,
      }))
    })
  }

  /** Toggle an item by id */
  const toggleItem = (id: string) => {
    const $multiple = get(multiple)
    items.update(($items) => {
      return $items.map(($item) => ({
        ...$item,
        expanded:
          $item.id === id
            ? !$item.expanded
            : $multiple
            ? $item.expanded
            : false,
      }))
    })
  }

  /** Open all items */
  const openAll = () => {
    items.update(($items) => {
      return $items.map(($item) => ({
        ...$item,
        expanded: true,
      }))
    })
  }

  /** Close all items */
  const closeAll = () => {
    items.update(($items) => {
      return $items.map(($item) => ({
        ...$item,
        expanded: false,
      }))
    })
  }

  const getFirstEnabledItem = () => {
    const $items = get(items)
    return $items.find(($item) => !$item.disabled)
  }

  /** TODO: Optimize this */
  const getLastEnabledItem = () => {
    const $items = get(items)
    return [...$items].reverse().find(($item) => !$item.disabled)
  }

  /** TODO: Optimize this */
  const getNextEnabledItem = (id: string): AccordionItem | null => {
    const $items = get(items)
    const $currentIndex = $items.findIndex(($item) => $item.id === id)
    const $nextIndex = $currentIndex + 1
    const $nextItem = $items[$nextIndex]
    if (!$nextItem) return null
    if ($nextItem.disabled) return getNextEnabledItem($nextItem.id)
    return $nextItem
  }

  /** TODO: Optimize this */
  const getPreviousEnabledItem = (id: string): AccordionItem | null => {
    const $items = get(items)
    const $currentIndex = $items.findIndex(($item) => $item.id === id)
    const $previousIndex = $currentIndex - 1
    const $previousItem = $items[$previousIndex]
    if (!$previousItem) return null
    if ($previousItem.disabled) return getPreviousEnabledItem($previousItem.id)
    return $previousItem
  }

  const createItemProvider = (itemConfig: AccordionItemConfig) => {
    const expanded = itemConfig?.expanded || false
    const disabled = itemConfig?.disabled || false

    const id = uuid()
    const triggerId = generateId()
    const contentId = generateId()

    const item: AccordionItem = {
      id,
      expanded,
      disabled,
    }

    // Register the item
    items.update(($items) => [...$items, item])

    // Open the item if it's expanded by default
    if (expanded) {
      openItem(id)
    }

    const state = derived(
      [items],
      ([$items]) => {
        const $item = $items.find(($item) => $item.id === id)
        // TODO: Handle item not found
        return {
          expanded: $item?.expanded ?? false,
          disabled: $item?.disabled ?? false,
        }
      },
      {
        expanded: expanded,
        disabled: disabled,
      }
    )

    const toggle = () => {
      if (get(state).disabled) return
      toggleItem(id)
    }

    const open = () => {
      if (get(state).disabled || get(state).expanded) return
      openItem(id)
    }

    const close = () => {
      if (get(state).disabled || !get(state).expanded) return
      closeItem(id)
    }

    const triggerAction: Action = (node) => {
      // Set the trigger element
      items.update(($items) => {
        return $items.map(($item) => {
          if ($item.id === id) {
            return {
              ...$item,
              triggerElement: node,
            }
          }
          return $item
        })
      })

      const onClick = (event: MouseEvent) => {
        event.preventDefault()
        toggle()
      }

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          toggle()
        }

        if (event.key === 'Escape') {
          event.preventDefault()
          close()
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault()
          getPreviousEnabledItem(id)?.triggerElement?.focus()
        }

        if (event.key === 'ArrowDown') {
          event.preventDefault()
          getNextEnabledItem(id)?.triggerElement?.focus()
        }

        if (event.key === 'Home') {
          event.preventDefault()
          getFirstEnabledItem()?.triggerElement?.focus()
        }

        if (event.key === 'End') {
          event.preventDefault()
          getLastEnabledItem()?.triggerElement?.focus()
        }
      }

      node.setAttribute('id', triggerId)
      node.setAttribute('role', 'button')
      node.setAttribute('aria-controls', contentId)

      node.addEventListener('click', onClick)
      node.addEventListener('keydown', onKeyDown)

      const unsubscribe = state.subscribe(($state) => {
        node.setAttribute('aria-expanded', `${$state.expanded}`)
        node.setAttribute('aria-disabled', `${$state.disabled}`)
        node.setAttribute('tabindex', `${$state.disabled ? '-1' : '0'}`)
      })

      return {
        destroy() {
          node.removeEventListener('click', onClick)
          node.removeEventListener('keydown', onKeyDown)
          unsubscribe()

          // Remove the item
          items.update(($items) => {
            return $items.filter(($item) => $item.id !== id)
          })
        },
      }
    }

    const contentAction: Action = (node) => {
      node.setAttribute('id', contentId)
      node.setAttribute('role', 'region')
      node.setAttribute('aria-labelledby', triggerId)

      const unsubscribe = state.subscribe(($state) => {
        node.setAttribute('aria-hidden', `${!$state.expanded}`)
      })

      return {
        destroy() {
          unsubscribe()
        },
      }
    }

    return {
      state,
      trigger: triggerAction,
      content: contentAction,
      toggle,
      open,
      close,
    }
  }

  return {
    multiple,
    createItemProvider,
    openAll,
    closeAll,
  }
}

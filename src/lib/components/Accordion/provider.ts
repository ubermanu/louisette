import { uuid } from '$lib/helpers.js'
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

  const createItemProvider = (itemConfig: AccordionItemConfig) => {
    const expanded = itemConfig?.expanded || false
    const disabled = itemConfig?.disabled || false

    const id = uuid()

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
      toggleItem(id)
    }

    const open = () => {
      openItem(id)
    }

    const close = () => {
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
          const $items = get(items)
          const index = $items.findIndex(($item) => $item.id === id)
          const $previous = $items[index - 1]
          $previous?.triggerElement?.focus()
        }

        if (event.key === 'ArrowDown') {
          event.preventDefault()
          const $items = get(items)
          const index = $items.findIndex(($item) => $item.id === id)
          const $next = $items[index + 1]
          $next?.triggerElement?.focus()
        }

        if (event.key === 'Home') {
          event.preventDefault()
          const $items = get(items)
          const $first = $items[0]
          $first?.triggerElement?.focus()
        }

        if (event.key === 'End') {
          event.preventDefault()
          const $items = get(items)
          const $last = $items[$items.length - 1]
          $last?.triggerElement?.focus()
        }
      }

      node.setAttribute('id', `${id}-trigger`)
      node.setAttribute('role', 'button')
      node.setAttribute('aria-controls', `${id}-content`)

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
      node.setAttribute('id', `${id}-content`)
      node.setAttribute('role', 'region')
      node.setAttribute('aria-labelledby', `${id}-trigger`)

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

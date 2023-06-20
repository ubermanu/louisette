import { mergeActions } from '$lib/helpers/actions.js'
import type { DelegateEvent } from '$lib/helpers/events.js'
import { delegateEventListeners } from '$lib/helpers/events.js'
import { traveller } from '$lib/helpers/traveller.js'
import { useFocusWithin } from '$lib/interactions/FocusWithin/index.js'
import { activeElement } from '$lib/stores/ActiveElement/activeElement.js'
import { tick } from 'svelte'
import type { Action } from 'svelte/action'
import { derived, get, readable, writable } from 'svelte/store'
import type { TagGroup, TagGroupConfig } from './tagGroup.types.js'

export const createTagGroup = (config?: TagGroupConfig): TagGroup => {
  const { disabled, onDismiss } = { ...config }

  const focusWithin = useFocusWithin()

  // The last focused key tag in the tag group
  const focused$ = writable<string | null>(null)
  const disabled$ = writable(disabled ?? [])

  // TODO: When dismissing a tag, the next tag is focused but not announced by screen readers
  const tagGroupAttrs = derived(focusWithin.focused, (focused) => ({
    role: 'listbox',
    'aria-atomic': 'false',
    'aria-relevant': 'additions',
    'aria-live': focused ? 'polite' : 'off',
  }))

  const tagAttrs = derived(focused$, (focused) => (tag: string) => {
    if (focused === null) {
      focused$.set(tag)
    }

    return {
      role: 'option',
      tabIndex: focused === tag ? 0 : -1,
      'data-tag-group-tag': tag,
    }
  })

  let tagGroupNode: HTMLElement | null = null

  // TODO: Implement keyboard nav etc...
  const useTagGroup: Action = (node) => {
    tagGroupNode = node

    const unsubscribe = activeElement.subscribe((element) => {
      if (
        element !== null &&
        tagGroupNode?.contains(element) &&
        element.hasAttribute('data-tag-group-tag')
      ) {
        focused$.set(element.getAttribute('data-tag-group-tag'))
      }
    })

    const onTagKeyDown = (event: DelegateEvent<KeyboardEvent>) => {
      const target = event.delegateTarget
      const nodes = traveller(node, '[data-tag-group-tag]', (node) => {
        return get(disabled$).includes(node.getAttribute('data-tag-group-tag')!)
      })

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          nodes.previous(target)?.focus()
          break
        case 'ArrowRight':
          event.preventDefault()
          nodes.next(target)?.focus()
          break
        case 'Home':
          event.preventDefault()
          nodes.first()?.focus()
          break
        case 'End':
          event.preventDefault()
          nodes.last()?.focus()
          break
        case 'Delete':
          event.preventDefault()
          const tag = target.getAttribute('data-tag-group-tag')!
          dismiss(tag)
          break
      }
    }

    const onDismissKeyDown = (event: DelegateEvent<KeyboardEvent>) => {
      const target = event.delegateTarget
      const tag = target.getAttribute('data-tag-group-dismiss')!
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault()
          dismiss(tag)
          break
      }
    }

    const onDismissClick = (event: DelegateEvent<MouseEvent>) => {
      const target = event.delegateTarget
      const tag = target.getAttribute('data-tag-group-dismiss')!
      dismiss(tag)
    }

    const removeListeners = delegateEventListeners(node, {
      keydown: {
        '[data-tag-group-tag]': onTagKeyDown,
        '[data-tag-group-dismiss]': onDismissKeyDown,
      },
      click: {
        '[data-tag-group-dismiss]': onDismissClick,
      },
    })

    return {
      destroy() {
        removeListeners()
        unsubscribe()
        tagGroupNode = null
      },
    }
  }

  const dismissButtonAttrs = readable((key: string) => ({
    'data-tag-group-dismiss': key,
    tabIndex: -1,
    'aria-label': 'Press Delete to remove this tag',
  }))

  // Triggers a dismiss action on the given key
  const dismiss = (key: string) => {
    if (get(disabled$)?.includes(key)) {
      return
    }

    if (!tagGroupNode) {
      console.error('Tag group node not found')
      return
    }

    const tag = tagGroupNode.querySelector(
      `[data-tag-group-tag="${key}"]`
    ) as HTMLElement | null

    if (!tag) {
      console.warn(`Tag element not found for the key: ${key}`)
      return
    }

    // Focus the next tag or the last one if there is no next
    const nodes = traveller(tagGroupNode!, '[data-tag-group-tag]', (node) => {
      return get(disabled$)?.includes(node.getAttribute('data-tag-group-tag')!)
    })
    const next = nodes.next(tag)?.getAttribute('data-tag-group-tag') ?? null

    onDismiss?.(key)

    tick().then(() => {
      // Try to focus the next tag when rendering is complete
      const nextNode = tagGroupNode?.querySelector(
        `[data-tag-group-tag="${next}"]`
      ) as HTMLElement | null
      if (nextNode) {
        nextNode.focus()
        focused$.set(next)
      } else {
        // Focus the last tag
        const nodes = traveller(
          tagGroupNode!,
          '[data-tag-group-tag]',
          (node) => {
            return get(disabled$).includes(
              node.getAttribute('data-tag-group-tag')!
            )
          }
        )
        nodes.last()?.focus()
        focused$.set(nodes.last()?.getAttribute('data-tag-group-tag') ?? null)
      }
    })
  }

  return {
    tagGroup: mergeActions(focusWithin.focusWithin, useTagGroup),
    tagGroupAttrs,
    tagAttrs,
    dismissButtonAttrs,
    dismiss,
  }
}

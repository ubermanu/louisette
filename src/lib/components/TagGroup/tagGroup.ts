import { onBrowserMount } from '$lib/helpers/environment.js'
import type { DelegateEvent } from '$lib/helpers/events.js'
import { delegateEventListeners } from '$lib/helpers/events.js'
import { traveller } from '$lib/helpers/traveller.js'
import { generateId } from '$lib/helpers/uuid.js'
import { activeElement } from '$lib/stores/ActiveElement/activeElement.js'
import { tick } from 'svelte'
import { derived, get, readable, writable } from 'svelte/store'
import type { TagGroup, TagGroupConfig } from './tagGroup.types.js'

export const createTagGroup = (config?: TagGroupConfig): TagGroup => {
  const { disabled, onDismiss } = { ...config }

  // The last focused key tag in the tag group
  const focused$ = writable<string | null>(null)
  const disabled$ = writable(disabled ?? [])

  const baseId = generateId()

  // TODO: When dismissing a tag, the next tag is focused but not announced by screen readers
  const tagGroupAttrs = readable({
    role: 'listbox',
    'data-taggroup': baseId,
  })

  const tagAttrs = derived(focused$, (focused) => (tag: string) => {
    if (focused === null) {
      focused$.set(tag)
    }

    return {
      role: 'option',
      tabIndex: focused === tag ? 0 : -1,
      'data-taggroup-tag': tag,
    }
  })

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
      `[data-taggroup-tag="${key}"]`
    ) as HTMLElement | null

    if (!tag) {
      console.warn(`Tag element not found for the key: ${key}`)
      return
    }

    // Focus the next tag or the last one if there is no next
    const nodes = traveller(tagGroupNode!, '[data-taggroup-tag]', (node) => {
      return get(disabled$)?.includes(node.dataset.taggroupTag!)
    })
    const next = nodes.next(tag)?.dataset.taggroupTag ?? null

    onDismiss?.(key)

    tick().then(() => {
      // Try to focus the next tag when rendering is complete
      const nextNode = tagGroupNode?.querySelector(
        `[data-taggroup-tag="${next}"]`
      ) as HTMLElement | null
      if (nextNode) {
        nextNode.focus()
        focused$.set(next)
      } else {
        // Focus the last tag
        const nodes = traveller(
          tagGroupNode!,
          '[data-taggroup-tag]',
          (node) => {
            return get(disabled$).includes(node.dataset.taggroupTag!)
          }
        )
        nodes.last()?.focus()
        focused$.set(nodes.last()?.dataset.taggroupTag ?? null)
      }
    })
  }

  const onTagKeyDown = (event: DelegateEvent<KeyboardEvent>) => {
    const target = event.delegateTarget

    const nodes = traveller(tagGroupNode!, '[data-taggroup-tag]', (node) => {
      return get(disabled$).includes(node.dataset.taggroupTag!)
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
        const tag = target.dataset.taggroupTag!
        dismiss(tag)
        break
    }
  }

  const onDismissKeyDown = (event: DelegateEvent<KeyboardEvent>) => {
    const target = event.delegateTarget
    const tag = target.dataset.taggroupDismiss!
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
    const tag = target.dataset.taggroupDismiss!
    dismiss(tag)
  }

  const dismissButtonAttrs = readable((key: string) => ({
    'data-taggroup-dismiss': key,
    tabIndex: -1,
    'aria-label': 'Press Delete to remove this tag',
  }))

  let tagGroupNode: HTMLElement | null = null

  // TODO: Implement keyboard nav etc...
  onBrowserMount(() => {
    tagGroupNode = document.querySelector(`[data-taggroup="${baseId}"]`)

    if (!tagGroupNode) {
      throw new Error('Could not find the tag group')
    }

    const unsubscribe = activeElement.subscribe((element) => {
      if (
        element !== null &&
        tagGroupNode?.contains(element) &&
        element.hasAttribute('data-taggroup-tag')
      ) {
        focused$.set(element.dataset.taggroupTag!)
      }
    })

    const removeListeners = delegateEventListeners(tagGroupNode, {
      keydown: {
        '[data-taggroup-tag]': onTagKeyDown,
        '[data-taggroup-dismiss]': onDismissKeyDown,
      },
      click: {
        '[data-taggroup-dismiss]': onDismissClick,
      },
    })

    return () => {
      removeListeners()
      unsubscribe()
    }
  })
  return {
    tagGroupAttrs,
    tagAttrs,
    dismissButtonAttrs,
    dismiss,
  }
}

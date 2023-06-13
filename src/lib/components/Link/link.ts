import type { Action } from 'svelte/action'
import { derived, get, writable } from 'svelte/store'
import type { Link, LinkConfig } from './link.types.js'

export const createLink = (config: LinkConfig): Link => {
  const { disabled, href, target } = { ...config }

  const disabled$ = writable(disabled || false)
  const href$ = writable(href || '')
  const target$ = writable(target || '_self')

  const linkAttrs = derived(disabled$, (disabled) => ({
    role: 'link',
    'aria-disabled': disabled,
    tabIndex: disabled ? -1 : 0,
  }))

  const onLinkClick = (event: MouseEvent) => {
    event.preventDefault()

    if (get(disabled$)) {
      return
    }

    navigate()
  }

  const onLinkKeyDown = (event: KeyboardEvent) => {
    if (get(disabled$)) {
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      navigate()
    }
  }

  const navigate = () => {
    const href = get(href$)
    const target = get(target$)

    if (href === '#') {
      // TODO: Scroll to top
      return
    } else if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView()
      return
    }

    window.open(href, target)
  }

  const useLink: Action = (node) => {
    node.addEventListener('click', onLinkClick)
    node.addEventListener('keydown', onLinkKeyDown)

    return {
      destroy() {
        node.removeEventListener('click', onLinkClick)
        node.removeEventListener('keydown', onLinkKeyDown)
      },
    }
  }

  return {
    href: href$,
    target: target$,
    disabled: disabled$,
    linkAttrs,
    link: useLink,
  }
}

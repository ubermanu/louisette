import { delegateEventListeners } from '$lib/helpers.js'
import { traveller } from '$lib/helpers/traveller.js'
import type { Action } from 'svelte/action'
import { derived, get, readable, readonly, writable } from 'svelte/store'

export type RadioGroupConfig = {
  selected?: string
  disabled?: string | string[]
}

export type RadioGroup = ReturnType<typeof createRadioGroup>

export const createRadioGroup = (config?: RadioGroupConfig) => {
  const { selected, disabled } = { ...config }

  const selected$ = writable(selected || '')
  const disabled$ = writable(
    disabled ? (Array.isArray(disabled) ? disabled : [disabled]) : []
  )

  const radioGroupAttrs = readable({
    role: 'radiogroup',
  })

  let firstRadioKey: string | undefined

  const radioAttrs = derived([selected$, disabled$], ([selected, disabled]) => {
    const isFocusable = (key: string) => {
      if (disabled.includes(key)) return false
      if (selected === key) return true
      if (selected === '' && !firstRadioKey) {
        firstRadioKey = key
        return true
      }
      return false
    }

    return (key: string) => ({
      role: 'radio',
      'aria-checked': selected === String(key),
      'aria-disabled': disabled.includes(String(key)),
      'data-radio-group-radio': key,
      tabIndex: isFocusable(String(key)) ? 0 : -1,
    })
  })

  const select = (key: string) => {
    if (!key || get(disabled$).includes(key)) return
    selected$.set(key)
  }

  const resolveRadioElement = (event: Event) => {
    const path = event.composedPath()
    const node = path.find(
      (el) =>
        el instanceof HTMLElement && el.hasAttribute('data-radio-group-radio')
    )
    return node as HTMLElement | undefined
  }

  const onRadioClick = (event: MouseEvent) => {
    const target = resolveRadioElement(event)
    select(target?.dataset.radioGroupRadio || '')
  }

  const onRadioKeyDown = (event: KeyboardEvent) => {
    const target = resolveRadioElement(event) as HTMLElement
    const key = target?.dataset.radioGroupRadio || ''

    if (event.key === ' ') {
      event.preventDefault()
      select(key)
    }

    if (!rootNode) {
      console.warn('No root node found for radio group')
      return
    }

    const $disabled = get(disabled$)

    const radios = traveller(rootNode, '[data-radio-group-radio]', (el) => {
      return !$disabled.includes(el.dataset.radioGroupRadio as string)
    })

    if (['ArrowDown', 'ArrowRight'].includes(event.key)) {
      event.preventDefault()
      radios.next(target)?.focus()
    }

    if (['ArrowUp', 'ArrowLeft'].includes(event.key)) {
      event.preventDefault()
      radios.previous(target)?.focus()
    }

    if (event.key === 'Home') {
      event.preventDefault()
      radios.first()?.focus()
    }

    if (event.key === 'End') {
      event.preventDefault()
      radios.last()?.focus()
    }
  }

  let rootNode: HTMLElement | null = null

  const useRadioGroup: Action = (node) => {
    rootNode = node

    const removeListeners = delegateEventListeners(node, {
      click: {
        '[data-radio-group-radio]': onRadioClick,
      },
      keydown: {
        '[data-radio-group-radio]': onRadioKeyDown,
      },
    })

    return {
      destroy() {
        removeListeners()
      },
    }
  }

  return {
    selected: readonly(selected$),
    disabled: disabled$,
    radioGroupAttrs,
    radioAttrs,
    radioGroup: useRadioGroup,
    select,
  }
}

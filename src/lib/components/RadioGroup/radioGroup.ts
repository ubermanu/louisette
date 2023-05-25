import { delegate } from '$lib/helpers.js'
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
    const target = resolveRadioElement(event)
    const key = target?.dataset.radioGroupRadio || ''

    if (event.key === ' ') {
      event.preventDefault()
      select(key)
    }

    const radios = Array.from(
      rootNode?.querySelectorAll('[data-radio-group-radio]') || []
    ) as HTMLElement[]

    if (['ArrowDown', 'ArrowRight'].includes(event.key) && radios.length > 1) {
      event.preventDefault()
      const index = radios.findIndex(
        (radio) => radio.dataset.radioGroupRadio === key
      )
      radios[index - 1]?.focus()
    }

    if (['ArrowUp', 'ArrowLeft'].includes(event.key) && radios.length > 1) {
      event.preventDefault()
      const index = radios.findIndex(
        (radio) => radio.dataset.radioGroupRadio === key
      )
      radios[index + 1]?.focus()
    }

    if (event.key === 'Home' && radios.length > 1) {
      event.preventDefault()
      radios[0]?.focus()
    }

    if (event.key === 'End' && radios.length > 1) {
      event.preventDefault()
      radios[radios.length - 1]?.focus()
    }
  }

  let rootNode: HTMLElement | null = null

  const useRadioGroup: Action = (node) => {
    rootNode = node

    const events = {
      click: {
        '[data-radio-group-radio]': onRadioClick,
      },
      keydown: {
        '[data-radio-group-radio]': onRadioKeyDown,
      },
    }

    const removeListeners = delegate(node, events)

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

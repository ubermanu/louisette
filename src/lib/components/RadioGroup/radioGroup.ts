import { onBrowserMount } from '$lib/helpers/environment.js'
import type { DelegateEvent } from '$lib/helpers/events.js'
import { delegateEventListeners } from '$lib/helpers/events.js'
import { traveller } from '$lib/helpers/traveller.js'
import { generateId } from '$lib/helpers/uuid.js'
import { derived, get, readable, readonly, writable } from 'svelte/store'
import type { RadioGroup, RadioGroupConfig } from './radioGroup.types.js'

export const createRadioGroup = (config?: RadioGroupConfig): RadioGroup => {
  const { selected, disabled } = { ...config }

  const selected$ = writable(selected || '')
  const disabled$ = writable(disabled || [])

  const baseId = generateId()

  const radioGroupAttrs = readable({
    role: 'radiogroup',
    'data-radiogroup': baseId,
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
      'data-radiogroup-radio': key,
      tabIndex: isFocusable(String(key)) ? 0 : -1,
    })
  })

  const select = (key: string) => {
    if (!key || get(disabled$).includes(key)) return
    selected$.set(key)
  }

  const onRadioClick = (event: DelegateEvent<MouseEvent>) => {
    select(event.delegateTarget.dataset.radiogroupRadio!)
  }

  const onRadioKeyDown = (event: DelegateEvent<KeyboardEvent>) => {
    const target = event.delegateTarget
    const key = target?.dataset.radiogroupRadio!

    if (event.key === ' ') {
      event.preventDefault()
      select(key)
      return
    }

    const $disabled = get(disabled$)

    const radios = traveller(rootNode!, '[data-radiogroup-radio]', (el) => {
      return $disabled.includes(el.dataset.radiogroupRadio!)
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

  onBrowserMount(() => {
    rootNode = document.querySelector(`[data-radiogroup="${baseId}"]`)

    if (!rootNode) {
      throw new Error('Could not find the radio group')
    }

    return delegateEventListeners(rootNode, {
      click: {
        '[data-radiogroup-radio]': onRadioClick,
      },
      keydown: {
        '[data-radiogroup-radio]': onRadioKeyDown,
      },
    })
  })

  return {
    selected: readonly(selected$),
    disabled: disabled$,
    radioGroupAttrs,
    radioAttrs,
    select,
  }
}

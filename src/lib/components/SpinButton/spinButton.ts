import { onBrowserMount } from '$lib/helpers/environment.js'
import { generateId } from '$lib/helpers/uuid.js'
import { derived, get, readonly, writable } from 'svelte/store'
import type { SpinButton, SpinButtonConfig } from './spinButton.types.js'

export const createSpinButton = (config?: SpinButtonConfig): SpinButton => {
  const { disabled, min, max, step, value, strict } = { ...config }

  const value$ = writable(value || 0)
  const disabled$ = writable(disabled || false)
  const invalid$ = writable(false)

  const min$ = writable(min || 0)
  const max$ = writable(max || 100)
  const step$ = writable(step || 1)

  const baseId = generateId()
  const inputId = `${baseId}-input`
  const incrementId = `${baseId}-increment`
  const decrementId = `${baseId}-decrement`

  const inputAttrs = derived(
    [disabled$, value$, invalid$],
    ([disabled, value, invalid]) => ({
      role: 'spinbutton',
      'aria-disabled': disabled,
      'aria-valuemin': config?.min || 0,
      'aria-valuemax': config?.max || 100,
      'aria-valuenow': value,
      'aria-invalid': invalid && !strict ? true : undefined,
      'data-spinbutton-input': inputId,
    })
  )

  // If the value is above or equal to the max, disable the increment button
  const incrementButtonAttrs = derived(
    [disabled$, value$, max$],
    ([disabled, value, max]) => {
      const isDisabled = value >= max || disabled
      return {
        role: 'button',
        'aria-disabled': isDisabled,
        tabIndex: isDisabled ? -1 : 0,
        'data-spinbutton-more': incrementId,
      }
    }
  )

  const decrementButtonAttrs = derived(
    [disabled$, value$, min$],
    ([disabled, value, min]) => {
      const isDisabled = value <= min || disabled
      return {
        role: 'button',
        'aria-disabled': isDisabled,
        tabIndex: isDisabled ? -1 : 0,
        'data-spinbutton-less': decrementId,
      }
    }
  )

  const increase = () => {
    const disabled = get(disabled$)

    if (disabled) {
      return
    }

    const value = get(value$)
    const max = get(max$)
    const step = get(step$)
    const newValue = value + step

    if (newValue > max) {
      value$.set(max)
    } else {
      value$.set(value + step)
    }
  }

  const decrease = () => {
    const disabled = get(disabled$)

    if (disabled) {
      return
    }

    const value = get(value$)
    const min = get(min$)
    const step = get(step$)
    const newValue = value - step

    if (newValue < min) {
      value$.set(min)
    } else {
      value$.set(value - step)
    }
  }

  const onInputChange = (event: Event) => {
    const disabled = get(disabled$)

    if (disabled) {
      return
    }

    const target = event.target as HTMLInputElement
    const value = Number(target.value)

    if (Number.isNaN(value)) {
      invalid$.set(true)
      return
    }

    const min = get(min$)
    const max = get(max$)

    if (value < min || value > max) {
      invalid$.set(true)
      return
    }
  }

  const onIncrementClick = (event: MouseEvent) => {
    event.preventDefault()
    increase()
  }

  const onIncrementKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      increase()
    }
  }

  const onDecrementClick = (event: MouseEvent) => {
    event.preventDefault()
    decrease()
  }

  const onDecrementKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      decrease()
    }
  }

  onBrowserMount(() => {
    const inputNode = document.querySelector<HTMLInputElement>(
      `[data-spinbutton-input="${inputId}"]`
    )

    if (!inputNode) {
      throw new Error('Could not find the input for the spin button')
    }

    const incrementNode = document.querySelector<HTMLButtonElement>(
      `[data-spinbutton-more="${incrementId}"]`
    )

    if (!incrementNode) {
      throw new Error('Could not find the increment button for the spin button')
    }

    const decrementNode = document.querySelector<HTMLButtonElement>(
      `[data-spinbutton-less="${decrementId}"]`
    )

    if (!decrementNode) {
      throw new Error('Could not find the decrement button for the spin button')
    }

    inputNode.addEventListener('change', onInputChange)
    incrementNode.addEventListener('click', onIncrementClick)
    incrementNode.addEventListener('keydown', onIncrementKeyDown)
    decrementNode.addEventListener('click', onDecrementClick)
    decrementNode.addEventListener('keydown', onDecrementKeyDown)

    // Update the input value and invalid state when the value changes
    const unsubscribe = value$.subscribe((value) => {
      inputNode.value = value.toString()

      const min = get(min$)
      const max = get(max$)
      let isInvalid = false

      if (strict) {
        if (value < min) {
          value$.set(min)
        } else if (value > max) {
          value$.set(max)
        }
      } else {
        if (value < min || value > max) {
          isInvalid = true
        }
      }

      invalid$.set(isInvalid)
    })

    return () => {
      unsubscribe()
      inputNode.removeEventListener('change', onInputChange)
      incrementNode.removeEventListener('click', onIncrementClick)
      incrementNode.removeEventListener('keydown', onIncrementKeyDown)
      decrementNode.removeEventListener('click', onDecrementClick)
      decrementNode.removeEventListener('keydown', onDecrementKeyDown)
    }
  })

  return {
    value: value$,
    disabled: disabled$,
    invalid: readonly(invalid$),
    inputAttrs,
    incrementButtonAttrs,
    decrementButtonAttrs,
    increase,
    decrease,
  }
}

import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Readable, Writable } from 'svelte/store'

export type SpinButtonConfig = {
  /** If true, the input will be disabled. */
  disabled?: boolean

  /** If true, the input will be readonly. */
  readonly?: boolean

  /** The initial value of the input. Defaults to 0. */
  value?: number

  /** The minimum value of the input. Defaults to 0. */
  min?: number

  /** The maximum value of the input. Defaults to 100. */
  max?: number

  /** The amount to increment or decrement the value by. Defaults to 1. */
  step?: number

  /**
   * If true, the value will be clamped to the min and max values. And the input
   * will never be marked as invalid.
   */
  strict?: boolean
}

export type SpinButton = {
  value: Writable<number>
  disabled: Writable<boolean>
  invalid: Readable<boolean>
  inputAttrs: Readable<HTMLAttributes>
  incrementButtonAttrs: Readable<HTMLAttributes>
  decrementButtonAttrs: Readable<HTMLAttributes>
  increase: () => void
  decrease: () => void
}

import { render } from '@testing-library/svelte'
import { afterEach, describe, expect, test, vi } from 'vitest'
import FormTest from './Form.test.svelte'

describe('FocusWithin', () => {
  const onFocusWithin = vi.fn()
  const onBlurWithin = vi.fn()
  const onFocusChange = vi.fn()

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('Focus on any element should trigger the events', async () => {
    const { getByTestId, component } = render(FormTest)

    component.$on('focus:within', onFocusWithin)
    component.$on('blur:within', onBlurWithin)
    component.$on('focus:change', onFocusChange)

    expect(onFocusWithin).toHaveBeenCalledTimes(0)
    expect(onBlurWithin).toHaveBeenCalledTimes(0)
    expect(onFocusChange).toHaveBeenCalledTimes(0)

    getByTestId('email').focus()

    expect(onFocusWithin).toHaveBeenCalledTimes(1)
    expect(onBlurWithin).toHaveBeenCalledTimes(0)
    expect(onFocusChange).toHaveBeenCalledTimes(1)

    getByTestId('password').focus()

    expect(onFocusWithin).toHaveBeenCalledTimes(1)
    expect(onBlurWithin).toHaveBeenCalledTimes(0)
    expect(onFocusChange).toHaveBeenCalledTimes(1)

    getByTestId('outside').focus()

    expect(onFocusWithin).toHaveBeenCalledTimes(1)
    expect(onBlurWithin).toHaveBeenCalledTimes(1)
    expect(onFocusChange).toHaveBeenCalledTimes(2)

    getByTestId('submit').focus()

    expect(onFocusWithin).toHaveBeenCalledTimes(2)
    expect(onBlurWithin).toHaveBeenCalledTimes(1)
    expect(onFocusChange).toHaveBeenCalledTimes(3)
  })
})

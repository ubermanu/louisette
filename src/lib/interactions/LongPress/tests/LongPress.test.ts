import { fireEvent, render } from '@testing-library/svelte'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import ButtonTest from './Button.test.svelte'

describe('LongPress', async () => {
  const onLongPress = vi.fn()
  const onLongPressStart = vi.fn()
  const onLongPressEnd = vi.fn()

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const initialize = () => {
    const { getByTestId, component } = render(ButtonTest)

    component.$on('longpress', onLongPress)
    component.$on('longpress:start', onLongPressStart)
    component.$on('longpress:end', onLongPressEnd)

    return getByTestId('button')
  }

  test('Pressing longer than the threshold should fire the event', async () => {
    const button = initialize()

    await fireEvent.pointerDown(button)

    expect(onLongPress).toHaveBeenCalledTimes(0)
    expect(onLongPressStart).toHaveBeenCalledTimes(1)
    expect(onLongPressEnd).toHaveBeenCalledTimes(0)

    vi.advanceTimersByTime(1000)
    expect(onLongPress).toHaveBeenCalledTimes(1)
    expect(onLongPressEnd).toHaveBeenCalledTimes(1)
  })

  test('Releasing before the threshold should fire the correct event', async () => {
    const button = initialize()

    await fireEvent.pointerDown(button)

    expect(onLongPress).toHaveBeenCalledTimes(0)
    expect(onLongPressStart).toHaveBeenCalledTimes(1)
    expect(onLongPressEnd).toHaveBeenCalledTimes(0)

    vi.advanceTimersByTime(200)

    await fireEvent.pointerUp(button)

    expect(onLongPress).toHaveBeenCalledTimes(0)
    expect(onLongPressEnd).toHaveBeenCalledTimes(1)
  })
})

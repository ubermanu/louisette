import { fireEvent, render } from '@testing-library/svelte'
import { afterEach, describe, expect, test, vi } from 'vitest'
import ButtonTest from './Button.test.svelte'

describe('Press', async () => {
  test('Renders normally', async () => {
    const { getByTestId } = render(ButtonTest)
    expect(getByTestId('button')).toBeTruthy()
  })

  const onPress = vi.fn()
  const onPressStart = vi.fn()
  const onPressEnd = vi.fn()
  const onPressUp = vi.fn()
  const onPressChange = vi.fn()

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('Pressing the button with the keyboard fires the press events', async () => {
    const { getByTestId, component } = render(ButtonTest)

    component.$on('press', onPress)
    component.$on('press:start', onPressStart)
    component.$on('press:end', onPressEnd)
    component.$on('press:up', onPressUp)
    component.$on('press:change', onPressChange)

    await fireEvent.keyDown(getByTestId('button'), { key: 'Enter' })
    expect(onPressStart).toHaveBeenCalledTimes(1)
    expect(onPressChange).toHaveBeenCalledTimes(1)

    await fireEvent.keyUp(getByTestId('button'), { key: 'Enter' })
    expect(onPress).toHaveBeenCalledTimes(1)
    expect(onPressEnd).toHaveBeenCalledTimes(1)
    expect(onPressUp).toHaveBeenCalledTimes(1)
    expect(onPressChange).toHaveBeenCalledTimes(2)
  })

  test('Pressing the button with the mouse fires the press events', async () => {
    const { getByTestId, component } = render(ButtonTest)

    component.$on('press', onPress)
    component.$on('press:start', onPressStart)
    component.$on('press:end', onPressEnd)
    component.$on('press:up', onPressUp)
    component.$on('press:change', onPressChange)

    await fireEvent.pointerDown(getByTestId('button'), {
      button: 0,
      pointerType: 'mouse',
    })
    expect(onPressStart).toHaveBeenCalledTimes(1)
    expect(onPressChange).toHaveBeenCalledTimes(1)

    await fireEvent.pointerUp(getByTestId('button'), {
      button: 0,
      pointerType: 'mouse',
    })
    expect(onPress).toHaveBeenCalledTimes(1)
    expect(onPressEnd).toHaveBeenCalledTimes(1)
    expect(onPressUp).toHaveBeenCalledTimes(1)
    expect(onPressChange).toHaveBeenCalledTimes(2)
  })
})

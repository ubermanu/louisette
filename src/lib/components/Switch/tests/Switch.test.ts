import { fireEvent, render } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'

import SwitchTest from './Switch.test.svelte'

describe('Switch', async () => {
  test('Renders normally', async () => {
    const { getByTestId } = render(SwitchTest)
    expect(getByTestId('switch')).toBeTruthy()
    expect(getByTestId('switch').getAttribute('aria-checked')).toBe('false')
  })

  test('Renders as disabled', async () => {
    const { getByTestId } = render(SwitchTest, {
      props: { defaults: { disabled: true } },
    })
    expect(getByTestId('switch').getAttribute('aria-disabled')).toBe('true')
    expect(getByTestId('switch').getAttribute('tabindex')).toBe('-1')
  })

  test('Renders as activated', async () => {
    const { getByTestId } = render(SwitchTest, {
      props: { defaults: { active: true } },
    })

    expect(getByTestId('switch').getAttribute('aria-checked')).toBe('true')
  })

  test('Clicking on the switch toggles its state', async () => {
    const { getByTestId } = render(SwitchTest)

    await fireEvent.click(getByTestId('switch'))
    expect(getByTestId('switch').getAttribute('aria-checked')).toBe('true')

    await fireEvent.click(getByTestId('switch'))
    expect(getByTestId('switch').getAttribute('aria-checked')).toBe('false')
  })

  test('Pressing space or enter on the switch toggles its state', async () => {
    const { getByTestId } = render(SwitchTest)

    await fireEvent.keyDown(getByTestId('switch'), { key: ' ' })
    expect(getByTestId('switch').getAttribute('aria-checked')).toBe('true')

    await fireEvent.keyDown(getByTestId('switch'), { key: 'Enter' })
    expect(getByTestId('switch').getAttribute('aria-checked')).toBe('false')
  })

  test('Interacting with a disabled switch does not toggle its state', async () => {
    const { getByTestId } = render(SwitchTest, {
      props: { defaults: { disabled: true } },
    })

    await fireEvent.click(getByTestId('switch'))
    expect(getByTestId('switch').getAttribute('aria-checked')).toBe('false')

    await fireEvent.keyDown(getByTestId('switch'), { key: ' ' })
    expect(getByTestId('switch').getAttribute('aria-checked')).toBe('false')

    await fireEvent.keyDown(getByTestId('switch'), { key: 'Enter' })
    expect(getByTestId('switch').getAttribute('aria-checked')).toBe('false')
  })
})

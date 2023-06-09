import { fireEvent, render } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'

import ToggleButtonTest from './ToggleButton.test.svelte'

describe('ToggleButton', async () => {
  test('Renders normally', async () => {
    const { getByTestId } = render(ToggleButtonTest)
    expect(getByTestId('toggle-button')).toBeTruthy()
  })

  test('Renders as disabled', async () => {
    const { getByTestId } = render(ToggleButtonTest, {
      props: { defaults: { disabled: true } },
    })
    expect(getByTestId('toggle-button').getAttribute('aria-disabled')).toBe(
      'true'
    )
    expect(getByTestId('toggle-button').getAttribute('tabindex')).toBe('-1')
  })

  test('Renders as checked', async () => {
    const { getByTestId } = render(ToggleButtonTest, {
      props: { defaults: { checked: true } },
    })
    expect(getByTestId('toggle-button').getAttribute('aria-pressed')).toBe(
      'true'
    )
  })

  // TODO: Test the keypress event to avoid duplication?
  test('Pressing enter or space on the button toggles its state', async () => {
    const { getByTestId } = render(ToggleButtonTest)
    await fireEvent.keyDown(getByTestId('toggle-button'), { key: 'Enter' })
    expect(getByTestId('toggle-button').getAttribute('aria-pressed')).toBe(
      'true'
    )
  })

  // TODO: Test the click event to avoid duplication?
  test('Clicking on the button toggles its state', async () => {
    const { getByTestId } = render(ToggleButtonTest)
    await fireEvent.click(getByTestId('toggle-button'))
    expect(getByTestId('toggle-button').getAttribute('aria-pressed')).toBe(
      'true'
    )
  })
})

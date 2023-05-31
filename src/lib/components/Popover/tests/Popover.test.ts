import { fireEvent, render } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import PopoverTest from './Popover.test.svelte'

describe('Popover', async () => {
  test('Renders normally', async () => {
    const { getByTestId } = render(PopoverTest)
    expect(getByTestId('trigger')).toBeTruthy()
    expect(getByTestId('popover')).toBeTruthy()
  })

  test('Interact with the trigger toggles the popover', async () => {
    const { getByTestId } = render(PopoverTest)

    expect(getByTestId('popover').getAttribute('aria-hidden')).toBe('true')

    await fireEvent.click(getByTestId('trigger'))

    expect(getByTestId('trigger').getAttribute('aria-expanded')).toBe('true')
    expect(getByTestId('popover').getAttribute('aria-hidden')).toBe('false')
  })

  test('Handles keyboard navigation', async () => {
    const { getByTestId } = render(PopoverTest)

    expect(getByTestId('trigger').getAttribute('aria-expanded')).toBe('false')

    await fireEvent.keyDown(getByTestId('trigger'), { key: 'Escape' })
    expect(getByTestId('trigger').getAttribute('aria-expanded')).toBe('false')

    await fireEvent.keyDown(getByTestId('trigger'), { key: 'Enter' })
    expect(getByTestId('trigger').getAttribute('aria-expanded')).toBe('true')

    await fireEvent.keyDown(getByTestId('trigger'), { key: 'Escape' })
    expect(getByTestId('trigger').getAttribute('aria-expanded')).toBe('false')

    await fireEvent.keyDown(getByTestId('trigger'), { key: ' ' })
    expect(getByTestId('trigger').getAttribute('aria-expanded')).toBe('true')

    await fireEvent.keyDown(getByTestId('trigger'), { key: 'Escape' })
    expect(getByTestId('trigger').getAttribute('aria-expanded')).toBe('false')
  })
})

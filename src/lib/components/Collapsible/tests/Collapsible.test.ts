import { fireEvent, render } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'

import CollapsibleTest from './Collapsible.test.svelte'

describe('Collapsible', async () => {
  test('Renders as closed by default', async () => {
    const { getByTestId } = render(CollapsibleTest)
    expect(getByTestId('trigger').getAttribute('aria-expanded')).toBe('false')
    expect(getByTestId('content').getAttribute('aria-hidden')).toBe('true')
  })

  test('Click on the trigger opens the content', async () => {
    const { getByTestId } = render(CollapsibleTest)
    await fireEvent.click(getByTestId('trigger'))
    expect(getByTestId('trigger').getAttribute('aria-expanded')).toBe('true')
    expect(getByTestId('content').getAttribute('aria-hidden')).toBe('false')
  })

  test('Expanded by defaults means its opened', async () => {
    const { getByTestId } = render(CollapsibleTest, {
      props: { defaults: { expanded: true } },
    })
    expect(getByTestId('trigger').getAttribute('aria-expanded')).toBe('true')
  })

  test('When disabled, ignore the toggle action', async () => {
    const { getByTestId } = render(CollapsibleTest, {
      props: { defaults: { disabled: true } },
    })
    expect(getByTestId('trigger').getAttribute('aria-disabled')).toBe('true')
    await fireEvent.click(getByTestId('trigger'))
    expect(getByTestId('trigger').getAttribute('aria-expanded')).toBe('false')
  })

  test('Pressing enter or space on the trigger toggles the content', async () => {
    const { getByTestId } = render(CollapsibleTest)
    await fireEvent.keyDown(getByTestId('trigger'), { key: 'Enter' })
    expect(getByTestId('trigger').getAttribute('aria-expanded')).toBe('true')
    expect(getByTestId('content').getAttribute('aria-hidden')).toBe('false')
    await fireEvent.keyDown(getByTestId('trigger'), { key: ' ' })
    expect(getByTestId('trigger').getAttribute('aria-expanded')).toBe('false')
    expect(getByTestId('content').getAttribute('aria-hidden')).toBe('true')
  })

  test('Pressing other keys on the trigger does not toggle the content', async () => {
    const { getByTestId } = render(CollapsibleTest)
    await fireEvent.keyDown(getByTestId('trigger'), { key: 'a' })
    expect(getByTestId('trigger').getAttribute('aria-expanded')).toBe('false')
    expect(getByTestId('content').getAttribute('aria-hidden')).toBe('true')
  })

  test('Pressing enter or space on the trigger does not toggle the content when disabled', async () => {
    const { getByTestId } = render(CollapsibleTest, {
      props: { defaults: { disabled: true } },
    })
    await fireEvent.keyDown(getByTestId('trigger'), { key: 'Enter' })
    expect(getByTestId('trigger').getAttribute('aria-expanded')).toBe('false')
    expect(getByTestId('content').getAttribute('aria-hidden')).toBe('true')
  })

  test('Pressing escape on the trigger closes the content', async () => {
    const { getByTestId } = render(CollapsibleTest, {
      props: { defaults: { expanded: true } },
    })
    await fireEvent.keyDown(getByTestId('trigger'), { key: 'Escape' })
    expect(getByTestId('trigger').getAttribute('aria-expanded')).toBe('false')
    expect(getByTestId('content').getAttribute('aria-hidden')).toBe('true')
  })
})

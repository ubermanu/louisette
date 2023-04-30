import { fireEvent, render } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'

import AccordionTest from './Accordion.test.svelte'

describe('Accordion', async () => {
  test('Renders without any children gracefully', async () => {
    const { getByTestId } = render(AccordionTest)
    expect(getByTestId('accordion')).toBeTruthy()
  })

  test('Renders with children, closed by default', async () => {
    const { getByTestId } = render(AccordionTest, {
      props: {
        items: [
          { id: '1', label: 'Item 1', content: 'Content 1' },
          { id: '2', label: 'Item 2', content: 'Content 2' },
          { id: '3', label: 'Item 3', content: 'Content 3' },
        ],
      },
    })

    expect(getByTestId('accordion')).toBeTruthy()
    expect(getByTestId('accordion-item-1')).toBeTruthy()
    expect(getByTestId('accordion-item-2')).toBeTruthy()
    expect(getByTestId('accordion-item-3')).toBeTruthy()

    expect(
      getByTestId('accordion-item-1-trigger').getAttribute('aria-expanded')
    ).toBe('false')

    expect(
      getByTestId('accordion-item-1-content').getAttribute('aria-hidden')
    ).toBe('true')

    expect(
      getByTestId('accordion-item-2-trigger').getAttribute('aria-expanded')
    ).toBe('false')

    expect(
      getByTestId('accordion-item-2-content').getAttribute('aria-hidden')
    ).toBe('true')

    expect(
      getByTestId('accordion-item-3-trigger').getAttribute('aria-expanded')
    ).toBe('false')

    expect(
      getByTestId('accordion-item-3-content').getAttribute('aria-hidden')
    ).toBe('true')
  })

  test('Click on the trigger toggles its content', async () => {
    const { getByTestId } = render(AccordionTest, {
      props: {
        items: [{ id: '1', label: 'Item 1', content: 'Content 1' }],
      },
    })

    await fireEvent.click(getByTestId('accordion-item-1-trigger'))

    expect(
      getByTestId('accordion-item-1-trigger').getAttribute('aria-expanded')
    ).toBe('true')
  })

  test('Click on the trigger closes the other items', async () => {
    const { getByTestId } = render(AccordionTest, {
      props: {
        items: [
          { id: '1', label: 'Item 1', content: 'Content 1' },
          { id: '2', label: 'Item 2', content: 'Content 2' },
        ],
      },
    })

    await fireEvent.click(getByTestId('accordion-item-1-trigger'))
    expect(
      getByTestId('accordion-item-1-trigger').getAttribute('aria-expanded')
    ).toBe('true')

    expect(
      getByTestId('accordion-item-2-trigger').getAttribute('aria-expanded')
    ).toBe('false')

    await fireEvent.click(getByTestId('accordion-item-2-trigger'))

    expect(
      getByTestId('accordion-item-1-trigger').getAttribute('aria-expanded')
    ).toBe('false')

    expect(
      getByTestId('accordion-item-2-trigger').getAttribute('aria-expanded')
    ).toBe('true')
  })

  test('Click on the trigger keeps the other items opened when multiple is true', async () => {
    const { getByTestId } = render(AccordionTest, {
      props: {
        defaults: { multiple: true },
        items: [
          { id: '1', label: 'Item 1', content: 'Content 1' },
          { id: '2', label: 'Item 2', content: 'Content 2' },
        ],
      },
    })

    await fireEvent.click(getByTestId('accordion-item-1-trigger'))
    expect(
      getByTestId('accordion-item-1-trigger').getAttribute('aria-expanded')
    ).toBe('true')

    expect(
      getByTestId('accordion-item-2-trigger').getAttribute('aria-expanded')
    ).toBe('false')

    await fireEvent.click(getByTestId('accordion-item-2-trigger'))

    expect(
      getByTestId('accordion-item-1-trigger').getAttribute('aria-expanded')
    ).toBe('true')

    expect(
      getByTestId('accordion-item-2-trigger').getAttribute('aria-expanded')
    ).toBe('true')
  })
})

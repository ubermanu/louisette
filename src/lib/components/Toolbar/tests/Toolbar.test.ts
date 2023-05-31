import { fireEvent, render } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import ToolbarTest from './Toolbar.test.svelte'

describe('Toolbar', () => {
  test('Renders normally', async () => {
    const { getByTestId } = render(ToolbarTest)
    expect(getByTestId('toolbar')).toBeTruthy()
  })

  test('Renders with items', async () => {
    const { getByTestId } = render(ToolbarTest, {
      props: {
        items: [
          { id: 'bold', label: 'B' },
          { id: 'italic', label: 'I' },
          { id: 'underline', label: 'U' },
        ],
      },
    })

    expect(getByTestId('toolbar-item-bold')).toBeTruthy()
    expect(getByTestId('toolbar-item-italic')).toBeTruthy()
  })

  test('The first item should be focusable', async () => {
    const { getByTestId } = render(ToolbarTest, {
      props: {
        items: [
          { id: 'bold', label: 'B' },
          { id: 'italic', label: 'I' },
          { id: 'underline', label: 'U' },
        ],
      },
    })

    expect(getByTestId('toolbar-item-bold').getAttribute('tabindex')).toBe('0')
    expect(getByTestId('toolbar-item-italic').getAttribute('tabindex')).toBe(
      '-1'
    )
    expect(getByTestId('toolbar-item-underline').getAttribute('tabindex')).toBe(
      '-1'
    )
  })

  test('Handles keyboard navigation', async () => {
    const { getByTestId } = render(ToolbarTest, {
      props: {
        items: [
          { id: 'bold', label: 'B' },
          { id: 'italic', label: 'I' },
          { id: 'underline', label: 'U' },
        ],
      },
    })

    await fireEvent.keyDown(getByTestId('toolbar-item-bold'), {
      key: 'ArrowRight',
    })

    expect(document.activeElement).toBe(getByTestId('toolbar-item-italic'))

    await fireEvent.keyDown(getByTestId('toolbar-item-italic'), {
      key: 'ArrowLeft',
    })

    expect(document.activeElement).toBe(getByTestId('toolbar-item-bold'))

    await fireEvent.keyDown(getByTestId('toolbar-item-bold'), { key: 'End' })

    expect(document.activeElement).toBe(getByTestId('toolbar-item-underline'))

    await fireEvent.keyDown(getByTestId('toolbar-item-underline'), {
      key: 'Home',
    })

    expect(document.activeElement).toBe(getByTestId('toolbar-item-bold'))
  })

  test('Handles keyboard navigation (vertical)', async () => {
    const { getByTestId } = render(ToolbarTest, {
      props: {
        items: [
          { id: 'bold', label: 'B' },
          { id: 'italic', label: 'I' },
          { id: 'underline', label: 'U' },
        ],
        defaults: {
          orientation: 'vertical',
        },
      },
    })

    await fireEvent.keyDown(getByTestId('toolbar-item-bold'), {
      key: 'ArrowDown',
    })
    expect(document.activeElement).toBe(getByTestId('toolbar-item-italic'))

    await fireEvent.keyDown(getByTestId('toolbar-item-italic'), {
      key: 'ArrowUp',
    })
    expect(document.activeElement).toBe(getByTestId('toolbar-item-bold'))
  })

  test('The last focused item should be focusable', async () => {
    const { getByTestId } = render(ToolbarTest, {
      props: {
        items: [
          { id: 'bold', label: 'B' },
          { id: 'italic', label: 'I' },
          { id: 'underline', label: 'U' },
        ],
      },
    })

    await fireEvent.keyDown(getByTestId('toolbar-item-bold'), { key: 'End' })

    expect(document.activeElement).toBe(getByTestId('toolbar-item-underline'))

    expect(getByTestId('toolbar-item-bold').getAttribute('tabindex')).toBe('-1')
    expect(getByTestId('toolbar-item-italic').getAttribute('tabindex')).toBe(
      '-1'
    )
    expect(getByTestId('toolbar-item-underline').getAttribute('tabindex')).toBe(
      '0'
    )
  })
})

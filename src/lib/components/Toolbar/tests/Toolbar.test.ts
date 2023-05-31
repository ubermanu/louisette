import { render } from '@testing-library/svelte'
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
})

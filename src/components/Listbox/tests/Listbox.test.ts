import { render } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'

import ListboxTest from './Listbox.test.svelte'

describe('Listbox', async () => {
  test('Renders normally', async () => {
    const { getByTestId } = render(ListboxTest)
    expect(getByTestId('listbox')).toBeTruthy()
  })

  test('Renders as horizontal', async () => {
    const { getByTestId } = render(ListboxTest, {
      props: { defaults: { orientation: 'horizontal' } },
    })

    expect(getByTestId('listbox').getAttribute('aria-orientation')).toBe(
      'horizontal'
    )
  })

  test('Render a listbox with options', async () => {
    const { getByTestId } = render(ListboxTest, {
      props: {
        items: [
          { id: 1, label: 'One', value: 'one' },
          { id: 2, label: 'Two', value: 'two' },
          { id: 3, label: 'Three', value: 'three' },
        ],
      },
    })

    expect(getByTestId('listbox').children.length).toBe(3)

    expect(getByTestId('option-1').textContent).toContain('One')
    expect(getByTestId('option-1').getAttribute('aria-selected')).toBe('false')

    expect(getByTestId('option-2').textContent).toContain('Two')
    expect(getByTestId('option-2').getAttribute('aria-selected')).toBe('false')

    expect(getByTestId('option-3').textContent).toContain('Three')
    expect(getByTestId('option-3').getAttribute('aria-selected')).toBe('false')
  })

  test('Render a listbox with options and a selected option', async () => {
    const { getByTestId } = render(ListboxTest, {
      props: {
        defaults: { selected: ['one'] },
        items: [
          { id: 1, label: 'One', value: 'one' },
          { id: 2, label: 'Two', value: 'two' },
          { id: 3, label: 'Three', value: 'three' },
        ],
      },
    })

    expect(getByTestId('option-1').getAttribute('aria-selected')).toBe('true')
  })

  test('Render a multiselect listbox with options and selected options', async () => {
    const { getByTestId } = render(ListboxTest, {
      props: {
        defaults: {
          multiple: true,
          selected: ['one', 'three'],
        },
        items: [
          { id: 1, label: 'One', value: 'one' },
          { id: 2, label: 'Two', value: 'two' },
          { id: 3, label: 'Three', value: 'three' },
        ],
      },
    })

    expect(getByTestId('option-1').getAttribute('aria-checked')).toBe('true')
    expect(getByTestId('option-3').getAttribute('aria-checked')).toBe('true')
  })
})

import { fireEvent, render } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'
import SelectTest from './Select.test.svelte'

describe('Select', function () {
  test('Renders normally', async () => {
    const { getByTestId } = render(SelectTest)
    expect(getByTestId('button')).toBeTruthy()
    expect(getByTestId('listbox')).toBeTruthy()
  })

  test('Renders with options', async () => {
    const { getByTestId } = render(SelectTest, {
      props: {
        options: [
          { label: 'One', value: 'one' },
          { label: 'Two', value: 'two' },
          { label: 'Three', value: 'three' },
        ],
      },
    })

    expect(getByTestId('listbox').children.length).toBe(3)
  })

  test('Renders with a selected option by default', async () => {
    const { getByTestId } = render(SelectTest, {
      props: {
        options: [
          { label: 'One', value: 'one' },
          { label: 'Two', value: 'two' },
          { label: 'Three', value: 'three' },
        ],
        defaults: { selected: ['one'] },
      },
    })

    // expect(getByTestId('button').textContent).toContain('One')
    expect(getByTestId('option-one').getAttribute('aria-selected')).toBe('true')
  })

  test('Clicking an option selects it', async () => {
    const { getByTestId } = render(SelectTest, {
      props: {
        options: [
          { label: 'One', value: 'one' },
          { label: 'Two', value: 'two' },
          { label: 'Three', value: 'three' },
        ],
      },
    })

    const button = getByTestId('button')
    expect(button.textContent).toContain('Select an option')

    await fireEvent.click(getByTestId('option-one'))
    expect(button.textContent).toContain('One')

    await fireEvent.click(getByTestId('option-two'))
    expect(button.textContent).toContain('Two')

    await fireEvent.click(getByTestId('option-three'))
    expect(button.textContent).toContain('Three')
  })

  test('Handles keyboard navigation', async () => {
    const { getByTestId } = render(SelectTest, {
      props: {
        options: [
          { label: 'One', value: 'one' },
          { label: 'Two', value: 'two' },
          { label: 'Three', value: 'three' },
        ],
      },
    })

    const button = getByTestId('button')
    expect(button.textContent).toContain('Select an option')

    await fireEvent.keyDown(button, { key: 'ArrowDown' })
    await fireEvent.keyDown(button, { key: 'Enter' })
    expect(getByTestId('option-one').getAttribute('aria-selected')).toBe('true')
    expect(button.textContent).toContain('One')
  })
})

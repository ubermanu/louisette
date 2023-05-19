import { fireEvent, render } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'

import CheckboxTest from './Checkbox.test.svelte'

describe('Checkbox', async () => {
  test('Renders normally', async () => {
    const { getByTestId } = render(CheckboxTest)
    expect(getByTestId('checkbox')).toBeTruthy()
    expect(getByTestId('checkbox').getAttribute('aria-checked')).toBe('false')
  })

  test('Renders as disabled', async () => {
    const { getByTestId } = render(CheckboxTest, {
      props: { defaults: { disabled: true } },
    })
    expect(getByTestId('checkbox').getAttribute('aria-disabled')).toBe('true')
    expect(getByTestId('checkbox').getAttribute('tabindex')).toBe('-1')
  })

  test('Renders as checked', async () => {
    const { getByTestId } = render(CheckboxTest, {
      props: { defaults: { checked: true } },
    })

    expect(getByTestId('checkbox').getAttribute('aria-checked')).toBe('true')
  })

  test('Clicking on the checkbox toggles its state', async () => {
    const { getByTestId } = render(CheckboxTest)

    await fireEvent.click(getByTestId('checkbox'))
    expect(getByTestId('checkbox').getAttribute('aria-checked')).toBe('true')

    await fireEvent.click(getByTestId('checkbox'))
    expect(getByTestId('checkbox').getAttribute('aria-checked')).toBe('false')
  })

  test('Pressing space on the checkbox toggles its state', async () => {
    const { getByTestId } = render(CheckboxTest)

    await fireEvent.keyDown(getByTestId('checkbox'), { key: ' ' })
    expect(getByTestId('checkbox').getAttribute('aria-checked')).toBe('true')

    await fireEvent.keyDown(getByTestId('checkbox'), { key: ' ' })
    expect(getByTestId('checkbox').getAttribute('aria-checked')).toBe('false')
  })

  test('Render as indeterminate', async () => {
    const { getByTestId } = render(CheckboxTest, {
      props: { defaults: { indeterminate: true } },
    })

    expect(getByTestId('checkbox').getAttribute('aria-checked')).toBe('mixed')
  })

  test('Render as indeterminate and checked', async () => {
    const { getByTestId } = render(CheckboxTest, {
      props: { defaults: { indeterminate: true, checked: true } },
    })

    expect(getByTestId('checkbox').getAttribute('aria-checked')).toBe('mixed')
  })

  test('Clicking on the indeterminate checkbox toggles its state', async () => {
    const { getByTestId } = render(CheckboxTest, {
      props: { defaults: { indeterminate: true } },
    })

    await fireEvent.click(getByTestId('checkbox'))
    expect(getByTestId('checkbox').getAttribute('aria-checked')).toBe('true')
  })
})

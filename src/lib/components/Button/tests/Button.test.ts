import { render } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'

import ButtonTest from './Button.test.svelte'

describe('Button', async () => {
  test('Renders normally', async () => {
    const { getByTestId } = render(ButtonTest)
    expect(getByTestId('button')).toBeTruthy()
  })

  test('Renders as disabled', async () => {
    const { getByTestId } = render(ButtonTest, {
      props: { defaults: { disabled: true } },
    })
    expect(getByTestId('button').getAttribute('aria-disabled')).toBe('true')
    expect(getByTestId('button').getAttribute('tabindex')).toBe('-1')
  })
})

import { render } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'

import CalendarTest from './Calendar.test.svelte'

describe('Calendar', async () => {
  test('Renders normally', async () => {
    const { getByTestId } = render(CalendarTest)
    expect(getByTestId('calendar')).toBeTruthy()
  })

  test('Renders with a custom month and year', async () => {
    const { getByTestId } = render(CalendarTest, {
      props: {
        defaults: { month: 4, year: 2023 },
      },
    })
    expect(getByTestId('calendar')).toBeTruthy()

    expect(getByTestId('day-1').textContent?.trim()).toBe('30')
    expect(getByTestId('day-2').textContent?.trim()).toBe('1')
    expect(getByTestId('day-42').textContent?.trim()).toBe('10')
  })
})

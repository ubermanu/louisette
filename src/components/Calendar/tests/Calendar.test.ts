import { fireEvent, render } from '@testing-library/svelte'
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

  test('Clicking on the previous month button decrements the month', async () => {
    const { getByTestId } = render(CalendarTest, {
      props: {
        defaults: { month: 4, year: 2023 },
      },
    })

    await fireEvent.click(getByTestId('prev-month'))

    expect(getByTestId('day-1').textContent?.trim()).toBe('26')
  })

  test('Clicking on the next month button increments the month', async () => {
    const { getByTestId } = render(CalendarTest, {
      props: {
        defaults: { month: 4, year: 2023 },
      },
    })

    await fireEvent.click(getByTestId('next-month'))

    expect(getByTestId('day-1').textContent?.trim()).toBe('28')
  })

  test('Clicking on a day selects it', async () => {
    const { getByTestId } = render(CalendarTest, {
      props: {
        defaults: { month: 4, year: 2023 },
      },
    })

    await fireEvent.click(getByTestId('day-14'))

    expect(getByTestId('day-14').getAttribute('aria-selected')).toBe('true')

    await fireEvent.click(getByTestId('day-15'))

    expect(getByTestId('day-14').getAttribute('aria-selected')).toBeFalsy()
    expect(getByTestId('day-15').getAttribute('aria-selected')).toBe('true')
  })

  test('Renders the weekdays in the correct order (Sunday is the first day of the week)', async () => {
    const { getByTestId } = render(CalendarTest)

    expect(getByTestId('weekday-1').textContent?.trim()).toBe('Sun')
    expect(getByTestId('weekday-2').textContent?.trim()).toBe('Mon')
    expect(getByTestId('weekday-3').textContent?.trim()).toBe('Tue')
    expect(getByTestId('weekday-4').textContent?.trim()).toBe('Wed')
    expect(getByTestId('weekday-5').textContent?.trim()).toBe('Thu')
    expect(getByTestId('weekday-6').textContent?.trim()).toBe('Fri')
    expect(getByTestId('weekday-7').textContent?.trim()).toBe('Sat')
  })

  test('Have the first day of the month focusable if no day is selected', async () => {
    const { getByTestId } = render(CalendarTest, {
      props: {
        defaults: { month: 4, year: 2000 },
      },
    })

    expect(getByTestId('day-2').getAttribute('tabindex')).toBe('0')
  })

  test('Keyboard navigation works', async () => {
    const { getByTestId } = render(CalendarTest, {
      props: {
        defaults: { month: 4, year: 2023 },
      },
    })

    await fireEvent.focus(getByTestId('day-15'))

    await fireEvent.keyDown(getByTestId('day-15'), { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(getByTestId('day-14'))

    await fireEvent.keyDown(getByTestId('day-14'), { key: 'ArrowRight' })
    expect(document.activeElement).toBe(getByTestId('day-15'))

    await fireEvent.keyDown(getByTestId('day-15'), { key: 'ArrowUp' })
    expect(document.activeElement).toBe(getByTestId('day-8'))

    await fireEvent.keyDown(getByTestId('day-8'), { key: 'ArrowDown' })
    expect(document.activeElement).toBe(getByTestId('day-15'))

    await fireEvent.keyDown(getByTestId('day-15'), { key: 'Home' })
    expect(document.activeElement).toBe(getByTestId('day-2'))

    await fireEvent.keyDown(getByTestId('day-2'), { key: 'End' })
    expect(document.activeElement).toBe(getByTestId('day-32'))
  })

  test('PageUp and PageDown keys jump to the previous and next month, same day', async () => {
    const { getByTestId } = render(CalendarTest, {
      props: {
        defaults: { month: 1, year: 2020 },
      },
    })

    await fireEvent.focus(getByTestId('day-15'))

    await fireEvent.keyDown(getByTestId('day-15'), { key: 'PageUp' })

    expect(document.activeElement?.textContent?.trim()).toBe('9')

    await fireEvent.keyDown(document.activeElement!, { key: 'PageDown' })

    expect(document.activeElement?.textContent?.trim()).toBe('9')
  })
})

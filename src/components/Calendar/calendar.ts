import { delegate } from '$lib/helpers.js'
import type { Action } from 'svelte/action'
import { derived, get, readonly, writable, type Readable } from 'svelte/store'

export type CalendarConfig = {
  month?: number
  year?: number
  selected?: string | string[] | Date | Date[]
  disabled?: string | string[] | Date | Date[]
  onMonthChange?: () => void
  onYearChange?: () => void
  onSelectionChange?: () => void
  lang?: string
}

export type CalendarDay = {
  date: Date
  isWeekend: boolean
  isOutOfMonth: boolean
  dayProps: Record<string, any>
}

/** Returns a date in the format YYYY-MM-DD */
const dateToKey = (date: Date) => date.toISOString().slice(0, 10)
const keyToDate = (key: string) => new Date(key)

export const createCalendar = (config?: CalendarConfig) => {
  const {
    month,
    disabled,
    year,
    selected,
    onMonthChange,
    onYearChange,
    onSelectionChange,
  } = {
    ...config,
  }

  const today = new Date()
  const month$ = writable(month || today.getMonth())
  const year$ = writable(year || today.getFullYear())

  // Contains the dates that are selected (in the format YYYY-MM-DD)
  const selected$ = writable(
    (selected
      ? Array.isArray(selected)
        ? selected
        : [selected]
      : [today]
    ).map((date) => new Date(date).toISOString().slice(0, 10))
  )

  // Contains the dates that are disabled (in the format YYYY-MM-DD)
  const disabled$ = writable(
    (disabled ? (Array.isArray(disabled) ? disabled : [disabled]) : []).map(
      (date) => new Date(date).toISOString().slice(0, 10)
    )
  )

  const goToPrevMonth = () => {
    month$.update((m) => (m - 1) % 12)
    if (get(month$) === 11) {
      year$.update((y) => y - 1)
    }
  }

  const goToNextMonth = () => {
    month$.update((m) => (m + 1) % 12)
    if (get(month$) === 0) {
      year$.update((y) => y + 1)
    }
  }

  const goToPrevYear = () => {
    year$.update((y) => y - 1)
  }

  const goToNextYear = () => {
    year$.update((y) => y + 1)
  }

  const goToDate = (date: Date) => {
    month$.set(date.getMonth())
    year$.set(date.getFullYear())

    // Focus the date cell in the calendar
    rootNode
      ?.querySelector<HTMLElement>(
        `[data-calendar-day="${date.toISOString().slice(0, 10)}"]`
      )
      ?.focus()
  }

  const goToToday = () => {
    goToDate(today)
  }

  const title = derived([month$, year$], ([month, year]) => {
    const date = new Date(year, month)
    const formatter = new Intl.DateTimeFormat('en', { month: 'long' })
    return formatter.format(date)
  })

  const weekdays = derived([month$, year$], ([month, year]) => {
    const date = new Date(year, month)
    const formatter = new Intl.DateTimeFormat('en', { weekday: 'short' })
    const days = []
    for (let i = 0; i < 7; i++) {
      days.push(formatter.format(date))
      date.setDate(date.getDate() + 1)
    }
    return days
  })

  const onPrevMonthClick = () => {
    goToPrevMonth()
  }

  const onPrevMonthKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      goToPrevMonth()
    }
  }

  const onNextMonthClick = () => {
    goToNextMonth()
  }

  const onNextMonthKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      goToNextMonth()
    }
  }

  // TODO: Add support for selecting multiple dates (e.g. for a range)
  const onDayClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    const key = target.dataset.calendarDay || ''

    if (!key) return

    const parts = key.split('-')
    const date = new Date(+parts[0], +parts[1] - 1, +parts[2])

    goToDate(date)
    selected$.set([key])
  }

  // TODO: keyboard navigation
  const onDayKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    const key = target.dataset.calendarDay || ''

    if (!key) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selected$.set([key])
    }

    const date = keyToDate(key)

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goToDate(
        new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1)
      )
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goToDate(
        new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1)
      )
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      goToDate(
        new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)
      )
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      goToDate(
        new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7)
      )
    }

    if (event.key === 'Home') {
      event.preventDefault()
      goToDate(new Date(date.getFullYear(), date.getMonth(), 1))
    }

    if (event.key === 'End') {
      event.preventDefault()
      goToDate(new Date(date.getFullYear(), date.getMonth() + 1, 0))
    }

    if (event.key === 'PageUp') {
      event.preventDefault()
      goToPrevMonth()
    }

    if (event.key === 'PageDown') {
      event.preventDefault()
      goToNextMonth()
    }
  }

  let rootNode: HTMLElement | null = null

  const useCalendar: Action = (node) => {
    rootNode = node

    const events = {
      click: {
        '[data-calendar-prev-month]': onPrevMonthClick,
        '[data-calendar-next-month]': onNextMonthClick,
        '[data-calendar-day]': onDayClick,
      },
      keydown: {
        '[data-calendar-prev-month]': onPrevMonthKeyDown,
        '[data-calendar-next-month]': onNextMonthKeyDown,
        '[data-calendar-day]': onDayKeyDown,
      },
    }

    const removeListeners = delegate(node, events)

    return {
      destroy() {
        removeListeners()
      },
    }
  }

  month$.subscribe(() => {
    onMonthChange?.()
  })

  year$.subscribe(() => {
    onYearChange?.()
  })

  selected$.subscribe(() => {
    onSelectionChange?.()
  })

  // TODO: Get first day of week from locale.
  const generateDays = (
    month: number,
    year: number,
    startWeekday: number = 0
  ): CalendarDay[] => {
    if (year === -1 || month === -1) {
      return []
    }

    const data: { date: Date; isOutOfMonth: boolean }[] = []

    const $disabled = get(disabled$)
    const $selected = get(selected$)

    // Add the days of the previous month.
    const firstDay = new Date(year, month, 1)
    const lastDayOfPreviousMonth = new Date(year, month, 0)

    const previousMonthDaysToAdd =
      firstDay.getDay() - startWeekday < 0
        ? firstDay.getDay() - startWeekday + 7
        : firstDay.getDay() - startWeekday

    for (let i = previousMonthDaysToAdd; i > 0; i--) {
      data.push({
        date: new Date(
          year,
          month - 1,
          lastDayOfPreviousMonth.getDate() - i + 1
        ),
        isOutOfMonth: true,
      })
    }

    const lastDay = new Date(year, month + 1, 0)

    // Add the days of the current month.
    for (let i = 1; i <= lastDay.getDate(); i++) {
      data.push({
        date: new Date(year, month, i),
        isOutOfMonth: false,
      })
    }

    // Add the days of the next month.
    const nextMonthDaysToAdd = 42 - data.length
    for (let i = 1; i <= nextMonthDaysToAdd; i++) {
      data.push({
        date: new Date(year, month + 1, i),
        isOutOfMonth: true,
      })
    }

    return data.map(({ date, isOutOfMonth }) => {
      const key = date.toISOString().slice(0, 10)
      return {
        date,
        isOutOfMonth,
        isWeekend: isWeekend(date),
        dayProps: {
          'data-calendar-day': key,
          'aria-label': date.toDateString(),
          'aria-selected': $selected.includes(key) ? 'true' : undefined,
          'aria-disabled': $disabled.includes(key) ? 'true' : undefined,
          'aria-current': isSameDay(new Date(), date) ? 'date' : undefined,
          tabIndex: !isOutOfMonth && $selected.includes(key) ? 0 : -1,
        },
      }
    })
  }

  // TODO: Check according to locale.
  const isWeekend = (date: Date) => {
    return date.getDay() === 0 || date.getDay() === 6
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const days: Readable<CalendarDay[]> = derived(
    [month$, year$, selected$, disabled$],
    ([month, year, selected, disabled]) => {
      return generateDays(month, year)
    }
  )

  // TODO: Set disabled according to min and max.
  const prevButtonProps = derived([month$, year$], ([month, year]) => {
    return {
      'data-calendar-prev-month': '',
    }
  })

  // TODO: Set disabled according to min and max.
  const nextButtonProps = derived([month$, year$], ([month, year]) => {
    return {
      'data-calendar-next-month': '',
    }
  })

  return {
    month: month$,
    year: year$,
    selected: readonly(selected$),
    disabled: readonly(disabled$),
    title,
    weekdays,
    days,
    useCalendar,
    prevButtonProps,
    nextButtonProps,
    goToPrevMonth,
    goToNextMonth,
    goToPrevYear,
    goToNextYear,
    goToDate,
    goToToday,
  }
}

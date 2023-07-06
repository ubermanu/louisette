import { onBrowserMount } from '$lib/helpers/environment.js'
import type { DelegateEvent } from '$lib/helpers/events.js'
import { delegateEventListeners } from '$lib/helpers/events.js'
import { generateId } from '$lib/helpers/uuid.js'
import { tick } from 'svelte'
import {
  derived,
  get,
  readable,
  readonly,
  writable,
  type Readable,
} from 'svelte/store'
import type { Calendar, CalendarConfig, CalendarDay } from './calendar.types.js'

export const createCalendar = (config?: CalendarConfig): Calendar => {
  const {
    month,
    disabled,
    year,
    selected,
    onMonthChange,
    onYearChange,
    onSelectionChange,
    firstDayOfWeek,
  } = {
    ...config,
  }

  const today = new Date()
  const month$ = writable(month || today.getMonth())
  const year$ = writable(year || today.getFullYear())

  // TODO: Add support for different languages
  const firstDayOfWeek$ = writable(firstDayOfWeek || 7)

  const baseId = generateId()

  const calendarAttrs = readable({
    'data-calendar': baseId,
  })

  // Contains the dates that are selected (in the format YYYY-MM-DD)
  const selected$ = writable(
    (selected || [])
      .map((date) => (date ? new Date(date).toISOString().slice(0, 10) : ''))
      .filter(Boolean)
  )

  // Contains the dates that are disabled (in the format YYYY-MM-DD)
  const disabled$ = writable(
    (disabled || []).map((date) => new Date(date).toISOString().slice(0, 10))
  )

  const goToPrevMonth = () => {
    if (get(month$) === 0) {
      year$.update((y) => y - 1)
      month$.set(11)
    } else {
      month$.update((m) => (m - 1) % 12)
    }
  }

  const goToNextMonth = () => {
    if (get(month$) === 11) {
      year$.update((y) => y + 1)
      month$.set(0)
    } else {
      month$.update((m) => (m + 1) % 12)
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

    tick().then(() => {
      // Focus the date cell in the calendar
      calendarNode
        ?.querySelector<HTMLElement>(
          `[data-calendar-day="${date.toISOString().slice(0, 10)}"]`
        )
        ?.focus()
    })
  }

  const goToToday = () => {
    goToDate(today)
  }

  const disable = (date: string | Date) => {
    const key = new Date(date).toISOString().slice(0, 10)
    disabled$.update((disabled) => {
      if (disabled.includes(key)) return disabled
      return [...disabled, key]
    })
  }

  const enable = (date: string | Date) => {
    const key = new Date(date).toISOString().slice(0, 10)
    disabled$.update((disabled) => {
      if (!disabled.includes(key)) return disabled
      return disabled.filter((d) => d !== key)
    })
  }

  const title = derived([month$, year$], ([month, year]) => {
    const date = new Date(year, month)
    const formatter = new Intl.DateTimeFormat('en', { month: 'long' })
    return formatter.format(date) + ' ' + year
  })

  /**
   * Returns an array of weekdays as strings, starting with the first day of the
   * week
   */
  const weekdays = derived(firstDayOfWeek$, (firstDayOfWeek) => {
    const weekdays = []
    const formatter = new Intl.DateTimeFormat('en', { weekday: 'long' })

    for (let i = 0; i < 7; i++) {
      const dayIndex = (firstDayOfWeek + i) % 7
      const formattedDay = formatter.format(new Date(2023, 0, 1 + dayIndex))
      weekdays.push(formattedDay)
    }

    return weekdays
  })

  const onPrevMonthClick = () => {
    goToPrevMonth()
  }

  const onPrevMonthKeyDown = (event: DelegateEvent<KeyboardEvent>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      goToPrevMonth()
    }
  }

  const onNextMonthClick = () => {
    goToNextMonth()
  }

  const onNextMonthKeyDown = (event: DelegateEvent<KeyboardEvent>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      goToNextMonth()
    }
  }

  // TODO: Add support for selecting multiple dates (e.g. for a range)
  const onDayClick = (event: DelegateEvent<MouseEvent>) => {
    const target = event.delegateTarget
    const key = target.dataset.calendarDay as string

    const parts = key.split('-')
    const date = new Date(+parts[0], +parts[1] - 1, +parts[2])

    goToDate(date)
    selected$.set([key])
  }

  // TODO: keyboard navigation
  const onDayKeyDown = (event: DelegateEvent<KeyboardEvent>) => {
    const target = event.delegateTarget
    const key = target.dataset.calendarDay as string

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selected$.set([key])
    }

    const date = new Date(key)

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goToDate(
        new Date(
          Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() - 1)
        )
      )
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goToDate(
        new Date(
          Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 1)
        )
      )
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      goToDate(
        new Date(
          Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() - 7)
        )
      )
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      goToDate(
        new Date(
          Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 7)
        )
      )
    }

    if (event.key === 'Home') {
      event.preventDefault()
      goToDate(new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1)))
    }

    if (event.key === 'End') {
      event.preventDefault()
      goToDate(new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0)))
    }

    // TODO: ensure that the day is preserved
    if (event.key === 'PageUp') {
      event.preventDefault()
      goToDate(
        new Date(
          Date.UTC(date.getFullYear(), date.getMonth() - 1, date.getDate())
        )
      )
    }

    // TODO: ensure that the day is preserved
    if (event.key === 'PageDown') {
      event.preventDefault()
      goToDate(
        new Date(
          Date.UTC(date.getFullYear(), date.getMonth() + 1, date.getDate())
        )
      )
    }
  }

  let calendarNode: HTMLElement | null = null

  onBrowserMount(() => {
    calendarNode = document.querySelector(`[data-calendar="${baseId}"]`)

    if (!calendarNode) {
      throw new Error('Could not find the root node for the calendar')
    }

    return delegateEventListeners(calendarNode, {
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
    })
  })

  month$.subscribe(() => {
    onMonthChange?.()
  })

  year$.subscribe(() => {
    onYearChange?.()
  })

  selected$.subscribe(() => {
    onSelectionChange?.()
  })

  const days: Readable<CalendarDay[]> = derived(
    [month$, year$, selected$, disabled$, firstDayOfWeek$],
    ([month, year, selected, disabled, startWeekday]) => {
      if (year === -1 || month === -1) {
        return []
      }

      const data: { date: Date; isOutOfMonth: boolean }[] = []

      // Add the days of the previous month.
      const firstDay = new Date(Date.UTC(year, month, 1))
      const lastDayOfPreviousMonth = new Date(Date.UTC(year, month, 0))

      const previousMonthDaysToAdd =
        firstDay.getDay() - startWeekday < 0
          ? firstDay.getDay() - startWeekday + 7
          : firstDay.getDay() - startWeekday

      for (let i = previousMonthDaysToAdd; i > 0; i--) {
        data.push({
          date: new Date(
            Date.UTC(year, month - 1, lastDayOfPreviousMonth.getDate() - i + 1)
          ),
          isOutOfMonth: true,
        })
      }

      const lastDay = new Date(year, month + 1, 0)
      let firstDayOfMonth: Date

      // Add the days of the current month.
      for (let i = 1; i <= lastDay.getDate(); i++) {
        if (i === 1) {
          firstDayOfMonth = new Date(Date.UTC(year, month, i))
        }
        data.push({
          date: new Date(Date.UTC(year, month, i)),
          isOutOfMonth: false,
        })
      }

      // Add the days of the next month.
      const nextMonthDaysToAdd = 42 - data.length
      for (let i = 1; i <= nextMonthDaysToAdd; i++) {
        data.push({
          date: new Date(Date.UTC(year, month + 1, i)),
          isOutOfMonth: true,
        })
      }

      // Get the selected days in the current month.
      const selectedDays = selected
        .map((key) => key.split('-'))
        .filter(([y, m]) => Number(y) === year && Number(m) === month + 1)
        .map(([, , d]) => Number(d))

      return data.map(({ date, isOutOfMonth }) => {
        const key = date.toISOString().slice(0, 10)
        const day = date.getDate()
        const isToday = isSameDay(new Date(), date)

        // If the day is disabled, it cannot be focused.
        // If the day is out of month, it cannot be focused.
        // If the day is selected, and in the current month, it can be focused.
        // If there are no selected days, and the month is the current month, make the current day focusable.
        // Otherwise, make the first day of the month focusable.
        const isFocusable = (date: Date) => {
          if (disabled.includes(key) || isOutOfMonth) return false
          if (selectedDays.length > 0) return selectedDays.includes(day)
          if (isSameMonth(new Date(), date)) return isSameDay(new Date(), date)
          return isSameDay(firstDayOfMonth!, date)
        }

        return {
          date,
          key,
          isOutOfMonth,
          isToday,
          isSelected: selected.includes(key),
          isDisabled: disabled.includes(key),
          dayAttrs: {
            'data-calendar-day': key,
            'aria-label': date.toDateString(),
            'aria-selected': selected.includes(key) ? 'true' : undefined,
            'aria-disabled': disabled.includes(key) ? 'true' : undefined,
            'aria-current': isToday ? 'date' : undefined,
            'aria-hidden': isOutOfMonth ? 'true' : undefined,
            tabIndex: isFocusable(date) ? 0 : -1,
          },
        }
      })
    }
  )

  // TODO: Set disabled according to min and max.
  const prevButtonAttrs = derived([month$, year$], ([month, year]) => {
    return {
      'data-calendar-prev-month': '',
    }
  })

  // TODO: Set disabled according to min and max.
  const nextButtonAttrs = derived([month$, year$], ([month, year]) => {
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
    calendarAttrs,
    prevButtonAttrs,
    nextButtonAttrs,
    goToPrevMonth,
    goToNextMonth,
    goToPrevYear,
    goToNextYear,
    goToDate,
    goToToday,
    disable,
    enable,
  }
}

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const isSameMonth = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  )
}

import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Readable, Writable } from 'svelte/store'

export type CalendarConfig = {
  month?: number
  year?: number
  selected?: string[] | Date[]
  disabled?: string[] | Date[]
  onMonthChange?: () => void
  onYearChange?: () => void
  onSelectionChange?: () => void
  lang?: string
  firstDayOfWeek?: number
}

export type CalendarDay = {
  date: Date
  isOutOfMonth: boolean
  dayAttrs: HTMLAttributes
}

export type Calendar = {
  month: Writable<number>
  year: Writable<number>
  selected: Readable<string[]>
  disabled: Readable<string[]>
  title: Readable<string>
  weekdays: Readable<string[]>
  days: Readable<CalendarDay[]>
  calendarAttrs: Readable<HTMLAttributes>
  prevButtonAttrs: Readable<HTMLAttributes>
  nextButtonAttrs: Readable<HTMLAttributes>
  goToPrevMonth: () => void
  goToNextMonth: () => void
  goToPrevYear: () => void
  goToNextYear: () => void
  goToDate: (date: Date) => void
  goToToday: () => void
  disable: (date: Date) => void
  enable: (date: Date) => void
}

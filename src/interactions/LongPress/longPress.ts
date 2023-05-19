// @ts-nocheck
import { usePress, type PressEvent } from '../Press/press.js'

export type LongPressEvent = PressEvent & {
  type: 'longpressstart' | 'longpressend' | 'longpress'
}

export type LongPressConfig = {
  /** The number of milliseconds to wait before triggering the long press. */
  threshold?: number

  /**
   * Handler that is called when the threshold time is met while the press is
   * over the target.
   */
  onLongPress?: (event?: LongPressEvent) => void

  /** Handler that is called when a long press interaction starts. */
  onLongPressStart?: (event?: LongPressEvent) => void

  /**
   * Handler that is called when a long press interaction ends, either over the
   * target or when the pointer leaves the target.
   */
  onLongPressEnd?: (event?: LongPressEvent) => void
}

export const useLongPress = (config?: LongPressConfig) => {
  const {
    threshold = 1000,
    onLongPress,
    onLongPressStart,
    onLongPressEnd,
  } = {
    ...config,
  }

  let timer: number | undefined

  // FIXME: Release the pressed state when the long press is fulfilled
  const onPressStart = (event: PressEvent) => {
    if (timer) return
    onLongPressStart?.({ ...event, type: 'longpressstart' })
    timer = setTimeout(() => {
      onLongPress?.({ ...event, type: 'longpress' })
      onLongPressEnd?.({ ...event, type: 'longpressend' })
      timer = undefined
    }, threshold)
  }

  const onPressEnd = (event: PressEvent) => {
    if (timer) {
      clearTimeout(timer)
      timer = undefined
      onLongPressEnd?.({ ...event, type: 'longpressend' })
    }
  }

  const { pressEvents, ...rest } = usePress({
    onPressStart: onLongPressStart || onLongPress ? onPressStart : undefined,
    onPressEnd: onLongPressEnd ? onPressEnd : undefined,
  })

  return {
    longPressEvents: pressEvents,
    ...rest,
  }
}

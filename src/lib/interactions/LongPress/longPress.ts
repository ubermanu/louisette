import { usePress, type PressEvent } from '$lib/index.js'
import type { LongPress, LongPressConfig } from './longPress.types.js'

export const useLongPress = (config?: LongPressConfig): LongPress => {
  const {
    threshold = 1000,
    onLongPress,
    onLongPressStart,
    onLongPressEnd,
  } = {
    ...config,
  }

  let timer: number | undefined

  const onPressStart = (event: PressEvent) => {
    if (timer) return
    onLongPressStart?.({ ...event, type: 'longpressstart' })
    timer = window.setTimeout(() => {
      onLongPress?.({ ...event, type: 'longpress' })
      onLongPressEnd?.({ ...event, type: 'longpressend' })
      timer = undefined
    }, threshold)
  }

  const onPressEnd = (event: PressEvent) => {
    if (timer) {
      window.clearTimeout(timer)
      timer = undefined
      onLongPressEnd?.({ ...event, type: 'longpressend' })
    }
  }

  const { press, pressed } = usePress({
    onPressStart: onLongPressStart || onLongPress ? onPressStart : undefined,
    onPressEnd: onLongPressEnd ? onPressEnd : undefined,
  })

  return {
    longPress: press,
    pressed,
  }
}

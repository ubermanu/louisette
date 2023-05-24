import { derived, get, writable } from 'svelte/store'
import {
  usePress,
  type PressConfig,
  type PressEvent,
} from '../../interactions/Press/press.js'

export type ButtonConfig = {
  disabled?: boolean
  onPress?: PressConfig['onPress']
  onPressStart?: PressConfig['onPressStart']
  onPressEnd?: PressConfig['onPressEnd']
  onPressUp?: PressConfig['onPressUp']
}

export const createButton = (config: ButtonConfig) => {
  const { disabled } = { ...config }

  const disabled$ = writable(disabled || false)

  const buttonAttrs = derived([disabled$], ([disabled]) => ({
    role: 'button',
    'aria-disabled': disabled,
    tabIndex: disabled ? -1 : 0,
  }))

  // Guard against handlers being called when disabled.
  const whenEnabled = (handler: ((event?: PressEvent) => void) | undefined) => {
    if (handler) {
      return (event?: PressEvent) => {
        if (get(disabled$)) return
        handler(event)
      }
    }
  }

  const { onPress, onPressStart, onPressEnd, onPressUp } = { ...config }

  const { pressed, pressEvents } = usePress({
    onPress: whenEnabled(onPress),
    onPressStart: whenEnabled(onPressStart),
    onPressEnd: whenEnabled(onPressEnd),
    onPressUp: whenEnabled(onPressUp),
  })

  return {
    pressed,
    disabled: disabled$,
    buttonAttrs,
    useButton: pressEvents,
  }
}

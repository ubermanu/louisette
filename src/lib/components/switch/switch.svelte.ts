export interface SwitchConfig {
  checked: boolean
}

export function createSwitch(config?: SwitchConfig) {
  let checked = $state(config?.checked ?? false)

  let attrs = $derived({
    role: 'switch',
    'aria-checked': checked,
    onclick: onSwitchClick,
    onkeydown: onSwitchKeydown,
  })

  function onSwitchClick(event: MouseEvent) {
    event.preventDefault()
    checked = !checked
  }

  function onSwitchKeydown(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      checked = !checked
    }
  }

  class Switch {
    get checked() {
      return checked
    }
    set checked(_checked) {
      checked = _checked
    }
    get attrs() {
      return attrs
    }
  }

  return new Switch()
}

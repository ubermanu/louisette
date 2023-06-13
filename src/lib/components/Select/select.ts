import type { HTMLAttributes } from '$lib/helpers/types.js'
import { createListbox, createPopover, useTypeAhead } from '$lib/index.js'
import type { Action } from 'svelte/action'
import { derived, readable } from 'svelte/store'
import type { Select, SelectConfig } from './select.types.js'

export const createSelect = (config?: SelectConfig): Select => {
  const { multiple, disabled, selected } = { ...config }

  const listbox = createListbox({
    selected,
    disabled,
    multiple,
    orientation: 'vertical',
  })

  const typeahead = useTypeAhead()

  const popover = createPopover()

  const triggerAttrs = readable<HTMLAttributes>({
    role: 'select',
    'aria-haspopup': 'listbox',
  })

  const selectedLabel = derived(listbox.selected, (selected) => {
    if (selected.length === 0) return ''
    if (selected.length === 1) return selected[0]
    return `${selected.length} selected`
  })

  const useTrigger: Action = (node) => {}

  return {
    selected: listbox.selected,
    disabled: listbox.disabled,
    listboxAttrs: listbox.listboxAttrs,
    optionAttrs: listbox.optionAttrs,
    triggerAttrs,
    selectedLabel,
    trigger: useTrigger,
    listbox: listbox.listbox,
    select: listbox.select,
    unselect: listbox.unselect,
    toggle: listbox.toggle,
    selectAll: listbox.selectAll,
    unselectAll: listbox.unselectAll,
  } as Select
}

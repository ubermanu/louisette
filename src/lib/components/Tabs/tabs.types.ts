import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type TabsConfig = {
  /** The key of the active panel. */
  active?: string

  /** The key of the disabled panels. */
  disabled?: string | string[]

  /** The orientation of the tabs. */
  orientation?: 'horizontal' | 'vertical'

  /** The behavior of the tabs. */
  behavior?: 'auto' | 'manual'
}

export type Tabs = {
  active: Readable<string>
  disabled: Readable<string[]>
  orientation: Readable<'horizontal' | 'vertical'>
  listAttrs: Readable<HTMLAttributes>
  tabAttrs: Readable<(key: string) => HTMLAttributes>
  panelAttrs: Readable<(key: string) => HTMLAttributes>
  tabs: Action
  open: (key: string) => void
}

import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Readable } from 'svelte/store'

export type AccordionConfig = {
  expanded?: string[]
  disabled?: string[]
  multiple?: boolean
}

export type Accordion = {
  multiple: Readable<boolean>
  expanded: Readable<string[]>
  disabled: Readable<string[]>
  rootAttrs: Readable<HTMLAttributes>
  triggerAttrs: Readable<(key: string) => HTMLAttributes>
  contentAttrs: Readable<(key: string) => HTMLAttributes>
  expand: (key: string) => void
  collapse: (key: string) => void
  toggle: (key: string) => void
  expandAll: () => void
  collapseAll: () => void
  disable: (key: string) => void
  enable: (key: string) => void
}

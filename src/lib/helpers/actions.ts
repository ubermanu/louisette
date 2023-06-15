import type { Action } from 'svelte/action'

/** Merge multiple actions (non configurable) into one */
export const mergeActions = (...actions: Action[]): Action => {
  return (node) => {
    const destroyFns = actions.map((action) => action(node)).filter(Boolean)
    return {
      destroy() {
        destroyFns.forEach((fn) => fn?.destroy?.())
      },
    }
  }
}

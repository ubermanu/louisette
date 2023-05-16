<script lang="ts">
  import { writable } from 'svelte/store'
  import { setContext } from 'svelte'

  export let defaults = {
    multiple: false,
  }

  const multiple = writable(defaults?.multiple || false)

  type Trigger = {
    id: string
    element?: HTMLElement
  }

  const triggers = writable<Trigger[]>([])
  const expanded = writable([])
  const disabled = writable([])

  function open(id) {
    if ($disabled.includes(id)) return
    if ($multiple) {
      $expanded = [...$expanded, id]
    } else {
      $expanded = [id]
    }
  }

  function close(id) {
    if ($disabled.includes(id)) return
    $expanded = $expanded.filter((item) => item !== id)
  }

  function toggle(id) {
    if ($disabled.includes(id)) return
    if ($expanded.includes(id)) {
      close(id)
    } else {
      open(id)
    }
  }

  /** Returns the previous enabled trigger */
  function getPrevEnabledTrigger(id: string) {
    const index = $triggers.findIndex((t) => t.id === id)
    const prevTrigger = $triggers[index - 1]
    if (!prevTrigger) return null
    if ($disabled.includes(prevTrigger.id)) {
      return getPrevEnabledTrigger(prevTrigger.id)
    }
    return prevTrigger
  }

  /** Returns the next enabled trigger */
  function getNextEnabledTrigger(id: string) {
    const index = $triggers.findIndex((t) => t.id === id)
    const nextTrigger = $triggers[index + 1]
    if (!nextTrigger) return null
    if ($disabled.includes(nextTrigger.id)) {
      return getNextEnabledTrigger(nextTrigger.id)
    }
    return nextTrigger
  }

  /** Returns the first enabled trigger */
  function getFirstEnabledTrigger() {
    const firstTrigger = $triggers[0]
    if (!firstTrigger) return null
    if ($disabled.includes(firstTrigger.id)) {
      return getNextEnabledTrigger(firstTrigger.id)
    }
    return firstTrigger
  }

  /** Returns the last enabled trigger */
  function getLastEnabledTrigger() {
    const lastTrigger = $triggers[$triggers.length - 1]
    if (!lastTrigger) return null
    if ($disabled.includes(lastTrigger.id)) {
      return getPrevEnabledTrigger(lastTrigger.id)
    }
    return lastTrigger
  }

  setContext('accordion', {
    multiple,
    triggers,
    expanded,
    disabled,
    open,
    close,
    toggle,
    getPrevEnabledTrigger,
    getNextEnabledTrigger,
    getFirstEnabledTrigger,
    getLastEnabledTrigger,
  })
</script>

<slot multiple={$multiple} />

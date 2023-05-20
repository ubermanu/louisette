import { fireEvent, render } from '@testing-library/svelte'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import TypeAheadTest from './TypeAhead.test.svelte'

describe('TypeAhead', async () => {
  const onTypeAhead = vi.fn()
  const onTypeAheadStart = vi.fn()
  const onTypeAheadEnd = vi.fn()

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('Pressing a succession of letters should fire the events', async () => {
    const { getByTestId, component } = render(TypeAheadTest)

    component.$on('typeahead', onTypeAhead)
    component.$on('typeahead:start', onTypeAheadStart)
    component.$on('typeahead:end', onTypeAheadEnd)

    await fireEvent.keyDown(getByTestId('typeahead'), { key: 'a' })
    await fireEvent.keyDown(getByTestId('typeahead'), { key: 'b' })
    await fireEvent.keyDown(getByTestId('typeahead'), { key: 'c' })

    expect(onTypeAhead).toHaveBeenCalledTimes(3)
    expect(onTypeAheadStart).toHaveBeenCalledTimes(1)
    expect(onTypeAheadEnd).toHaveBeenCalledTimes(0)

    vi.advanceTimersByTime(1000)
    expect(onTypeAheadEnd).toHaveBeenCalledTimes(1)
  })

  test('Pressing Escape while typing should end the typeahead', async () => {
    const { getByTestId, component } = render(TypeAheadTest)

    component.$on('typeahead', onTypeAhead)
    component.$on('typeahead:start', onTypeAheadStart)
    component.$on('typeahead:end', onTypeAheadEnd)

    await fireEvent.keyDown(getByTestId('typeahead'), { key: 'a' })
    await fireEvent.keyDown(getByTestId('typeahead'), { key: 'b' })
    await fireEvent.keyDown(getByTestId('typeahead'), { key: 'c' })
    await fireEvent.keyDown(getByTestId('typeahead'), { key: 'Escape' })

    expect(onTypeAhead).toHaveBeenCalledTimes(3)
    expect(onTypeAheadStart).toHaveBeenCalledTimes(1)
    expect(onTypeAheadEnd).toHaveBeenCalledTimes(1)
  })

  test('Pressing Backspace while typing should remove the last character', async () => {
    const { getByTestId, component } = render(TypeAheadTest)

    component.$on('typeahead', onTypeAhead)
    component.$on('typeahead:start', onTypeAheadStart)
    component.$on('typeahead:end', onTypeAheadEnd)

    await fireEvent.keyDown(getByTestId('typeahead'), { key: 'a' })
    await fireEvent.keyDown(getByTestId('typeahead'), { key: 'b' })
    await fireEvent.keyDown(getByTestId('typeahead'), { key: 'c' })
    await fireEvent.keyDown(getByTestId('typeahead'), { key: 'Backspace' })

    expect(onTypeAhead).toHaveBeenCalledTimes(4)
    expect(onTypeAheadStart).toHaveBeenCalledTimes(1)
    expect(onTypeAheadEnd).toHaveBeenCalledTimes(0)

    vi.advanceTimersByTime(1000)

    expect(onTypeAheadEnd).toHaveBeenCalledTimes(1)
  })
})

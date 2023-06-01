import { fireEvent, render } from '@testing-library/svelte'
import { afterEach, describe, expect, test, vi } from 'vitest'
import ColorAreaTest from './ColorArea.test.svelte'

describe('Move', () => {
  const onMove = vi.fn()
  const onMoveStart = vi.fn()
  const onMoveEnd = vi.fn()

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('Dragging the element should move it', async () => {
    const { getByTestId, component } = render(ColorAreaTest)

    component.$on('move', onMove)
    component.$on('move:start', onMoveStart)
    component.$on('move:end', onMoveEnd)

    await fireEvent.pointerDown(getByTestId('handle'))

    expect(onMoveStart).toHaveBeenCalledTimes(1)
    expect(onMove).toHaveBeenCalledTimes(0)
    expect(onMoveEnd).toHaveBeenCalledTimes(0)

    await fireEvent.pointerMove(getByTestId('handle'), {
      movementX: 10,
      movementY: 10,
    })

    expect(onMoveStart).toHaveBeenCalledTimes(1)
    expect(onMove).toHaveBeenCalledTimes(1)
    expect(onMoveEnd).toHaveBeenCalledTimes(0)

    await fireEvent.pointerMove(getByTestId('handle'), {
      movementX: 10,
      movementY: 10,
    })

    expect(onMoveStart).toHaveBeenCalledTimes(1)
    expect(onMove).toHaveBeenCalledTimes(2)
    expect(onMoveEnd).toHaveBeenCalledTimes(0)

    await fireEvent.pointerUp(getByTestId('handle'))

    expect(onMoveStart).toHaveBeenCalledTimes(1)
    expect(onMove).toHaveBeenCalledTimes(2)
    expect(onMoveEnd).toHaveBeenCalledTimes(1)
  })

  test('Using the keyboard should move it', async () => {
    const { getByTestId, component } = render(ColorAreaTest)

    component.$on('move', onMove)
    component.$on('move:start', onMoveStart)
    component.$on('move:end', onMoveEnd)

    await fireEvent.keyDown(getByTestId('handle'), { key: 'ArrowDown' })
    await fireEvent.keyUp(getByTestId('handle'), { key: 'ArrowDown' })

    expect(onMoveStart).toHaveBeenCalledTimes(1)
    expect(onMove).toHaveBeenCalledTimes(1)
    expect(onMoveEnd).toHaveBeenCalledTimes(1)

    await fireEvent.keyDown(getByTestId('handle'), { key: 'ArrowRight' })
    await fireEvent.keyUp(getByTestId('handle'), { key: 'ArrowRight' })

    expect(onMoveStart).toHaveBeenCalledTimes(2)
    expect(onMove).toHaveBeenCalledTimes(2)
    expect(onMoveEnd).toHaveBeenCalledTimes(2)

    await fireEvent.keyDown(getByTestId('handle'), { key: 'ArrowUp' })
    await fireEvent.keyUp(getByTestId('handle'), { key: 'ArrowUp' })

    expect(onMoveStart).toHaveBeenCalledTimes(3)
    expect(onMove).toHaveBeenCalledTimes(3)
    expect(onMoveEnd).toHaveBeenCalledTimes(3)

    await fireEvent.keyDown(getByTestId('handle'), { key: 'ArrowLeft' })
    await fireEvent.keyUp(getByTestId('handle'), { key: 'ArrowLeft' })

    expect(onMoveStart).toHaveBeenCalledTimes(4)
    expect(onMove).toHaveBeenCalledTimes(4)
    expect(onMoveEnd).toHaveBeenCalledTimes(4)
  })
})

import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { expect, test } from 'vitest'
import ListboxTest from './Listbox.test.svelte'

test('when focus is received, set active to the first item', async () => {
  render(ListboxTest)

  const list = screen.getByTestId('list')
  expect(list.getAttribute('aria-activedescendant')).toBe(null)

  const user = userEvent.setup()
  await user.click(list)

  expect(list.getAttribute('aria-activedescendant')).toBe(
    screen.getByTestId('opt-1').id
  )
})

test('when focus is received, set active to the selection', async () => {
  render(ListboxTest, { selection: [2] })

  const list = screen.getByTestId('list')
  expect(list.getAttribute('aria-activedescendant')).toBe(null)

  const user = userEvent.setup()
  await user.click(list)

  expect(list.getAttribute('aria-activedescendant')).toBe(
    screen.getByTestId('opt-2').id
  )
})

test('arrow down moves focus to the next option', async () => {
  render(ListboxTest)

  const list = screen.getByTestId('list')
  const user = userEvent.setup()

  await user.click(list)
  await user.keyboard('{ArrowDown}')

  expect(list.getAttribute('aria-activedescendant')).toBe(
    screen.getByTestId('opt-2').id
  )
})

test('arrow up moves focus to the previous option', async () => {
  render(ListboxTest, { selection: [2] })

  const list = screen.getByTestId('list')
  const user = userEvent.setup()

  await user.click(list)
  await user.keyboard('{ArrowUp}')

  expect(list.getAttribute('aria-activedescendant')).toBe(
    screen.getByTestId('opt-1').id
  )
})

test('home key moves focus to the first option', async () => {
  render(ListboxTest, { selection: [2] })

  const list = screen.getByTestId('list')
  const user = userEvent.setup()

  await user.click(list)
  await user.keyboard('{Home}')

  expect(list.getAttribute('aria-activedescendant')).toBe(
    screen.getByTestId('opt-1').id
  )
})

test('end key moves focus to the last option', async () => {
  render(ListboxTest)

  const list = screen.getByTestId('list')
  const user = userEvent.setup()

  await user.click(list)
  await user.keyboard('{End}')

  expect(list.getAttribute('aria-activedescendant')).toBe(
    screen.getByTestId('opt-3').id
  )
})

test('arrow right moves the focus to the next option (horizontal)', async () => {
  render(ListboxTest, { orientation: 'horizontal' })

  const list = screen.getByTestId('list')
  const user = userEvent.setup()

  await user.click(list)
  await user.keyboard('{ArrowRight}')

  expect(list.getAttribute('aria-activedescendant')).toBe(
    screen.getByTestId('opt-2').id
  )
})

test('arrow left moves the focus to the previous option (horizontal)', async () => {
  render(ListboxTest, { orientation: 'horizontal', selection: [2] })

  const list = screen.getByTestId('list')
  const user = userEvent.setup()

  await user.click(list)
  await user.keyboard('{ArrowLeft}')

  expect(list.getAttribute('aria-activedescendant')).toBe(
    screen.getByTestId('opt-1').id
  )
})

test('when behavior is auto, focusing an item selects it', async () => {
  render(ListboxTest, { behavior: 'auto' })

  const list = screen.getByTestId('list')
  const user = userEvent.setup()

  await user.click(list)
  expect(screen.getByTestId('opt-1').getAttribute('aria-selected')).toBe('true')

  await user.keyboard('{ArrowDown}')
  expect(screen.getByTestId('opt-2').getAttribute('aria-selected')).toBe('true')
})

test('press space, selects the active element', async () => {
  render(ListboxTest)

  const list = screen.getByTestId('list')
  const user = userEvent.setup()

  await user.click(list)
  await user.keyboard('{ }')

  expect(screen.getByTestId('opt-1').getAttribute('aria-selected')).toBe('true')
})

test('the selection only have a single element', async () => {
  render(ListboxTest)

  const list = screen.getByTestId('list')
  const user = userEvent.setup()

  await user.click(list)
  await user.keyboard('{ }')

  expect(screen.getByTestId('opt-1').getAttribute('aria-selected')).toBe('true')

  await user.keyboard('{ArrowDown}')
  await user.keyboard('{ }')

  expect(screen.getByTestId('opt-1').getAttribute('aria-selected')).toBe(
    'false'
  )
  expect(screen.getByTestId('opt-2').getAttribute('aria-selected')).toBe('true')
})

test('press space 2 times, keeps the active element selected', async () => {
  render(ListboxTest)

  const list = screen.getByTestId('list')
  const user = userEvent.setup()

  await user.click(list)
  await user.keyboard('{ }')
  await user.keyboard('{ }')

  expect(screen.getByTestId('opt-1').getAttribute('aria-selected')).toBe('true')
})

test('the selection can have many elements (multiple)', async () => {
  render(ListboxTest, { multiple: true })

  const list = screen.getByTestId('list')
  const user = userEvent.setup()

  await user.click(list)
  await user.keyboard('{ }')
  await user.keyboard('{ArrowDown}')
  await user.keyboard('{ }')

  expect(screen.getByTestId('opt-1').getAttribute('aria-checked')).toBe('true')
  expect(screen.getByTestId('opt-2').getAttribute('aria-checked')).toBe('true')
})

test('press space 2 times, toggles the active element (multiple)', async () => {
  render(ListboxTest, { multiple: true })

  const list = screen.getByTestId('list')
  const user = userEvent.setup()

  await user.click(list)
  await user.keyboard('{ }')
  await user.keyboard('{ }')

  expect(screen.getByTestId('opt-1').getAttribute('aria-checked')).toBe('false')
})

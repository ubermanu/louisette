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

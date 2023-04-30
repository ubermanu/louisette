import { fireEvent, render } from '@testing-library/svelte'
import { expect, test } from 'vitest'

import CollapsibleTest from './CollapsibleTest.svelte'

test('Renders normally', async () => {
  const { getByTestId } = render(CollapsibleTest)

  expect(getByTestId('collapsible')).toBeTruthy()
})

test('Click on the trigger opens the content', async () => {
  const { getByTestId } = render(CollapsibleTest)

  const trigger = getByTestId('trigger')
  const content = getByTestId('content')

  expect(content.hasAttribute('hidden')).toBe(true)

  await fireEvent.click(trigger)
  expect(content.hasAttribute('hidden')).toBe(false)

  await fireEvent.click(trigger)
  expect(content.hasAttribute('hidden')).toBe(true)
})

test('The content is opened by default if the prop is passed', async () => {
  const { getByTestId } = render(CollapsibleTest, { open: true })

  const content = getByTestId('content')
  expect(content.hasAttribute('hidden')).toBe(false)
})

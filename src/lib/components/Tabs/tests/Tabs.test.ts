import { render } from '@testing-library/svelte'
import { describe, expect, test } from 'vitest'

import TabsTest from './Tabs.test.svelte'

describe('Tabs', async () => {
  test('Renders without items', async () => {
    const { getByTestId } = render(TabsTest)
    expect(getByTestId('tabs')).toBeTruthy()
    expect(getByTestId('tabs').children.length).toBe(0)
  })

  test('Renders with items', async () => {
    const { getByTestId } = render(TabsTest, {
      props: {
        items: [
          { id: 1, title: 'One', content: 'one' },
          { id: 2, title: 'Two', content: 'two' },
          { id: 3, title: 'Three', content: 'three' },
        ],
      },
    })

    expect(getByTestId('tabs').children.length).toBe(3 + 1)
    expect(getByTestId('list').children.length).toBe(3)
  })

  test('With an active tab by default', async () => {
    const { getByTestId } = render(TabsTest, {
      props: {
        defaults: { active: '2' },
        items: [
          { id: 1, title: 'One', content: 'one' },
          { id: 2, title: 'Two', content: 'two' },
          { id: 3, title: 'Three', content: 'three' },
        ],
      },
    })

    expect(getByTestId('tab-2').getAttribute('aria-selected')).toBe('true')
  })

  test('If no active tab by default, the first one is selected', async () => {
    const { getByTestId } = render(TabsTest, {
      props: {
        items: [
          { id: 1, title: 'One', content: 'one' },
          { id: 2, title: 'Two', content: 'two' },
          { id: 3, title: 'Three', content: 'three' },
        ],
      },
    })

    expect(getByTestId('tab-1').getAttribute('aria-selected')).toBe('true')
  })
})

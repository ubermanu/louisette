type Orientation = 'vertical' | 'horizontal'

export interface SliderConfig {
  orientation: Orientation
}

export function createSlider(config?: SliderConfig) {
  let values = $state<number[]>([])

  const baseId = crypto.randomUUID()
  const thumbId = (key: string | number) => `${baseId}-thumb-${key}`

  const gutter = $derived({
    id: baseId,
  })

  const thumb = $derived((key: string | number) => ({
    role: 'slider',
    id: thumbId(key),
  }))

  class Slider {
    get gutter() {
      return gutter
    }
    get values() {
      return values
    }
  }

  return new Slider()
}

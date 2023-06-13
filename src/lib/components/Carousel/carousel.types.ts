import type { HTMLAttributes } from '$lib/helpers/types.js'
import type { Action } from 'svelte/action'
import type { Readable } from 'svelte/store'

export type CarouselConfig = {
  /** The orientation of the carousel */
  orientation?: 'horizontal' | 'vertical'

  /**
   * Whether the carousel should loop back to the beginning when it reaches the
   * end
   */
  loop?: boolean

  /** Whether the carousel should autoplay */
  autoplay?: boolean

  /** The interval at which the carousel goes to the next slide (default: 5s) */
  interval?: number
}

export type Carousel = {
  current: Readable<string>
  status: Readable<string>
  carouselAttrs: Readable<HTMLAttributes>
  trackAttrs: Readable<HTMLAttributes>
  slideAttrs: Readable<(key: string) => HTMLAttributes>
  previousButtonAttrs: Readable<HTMLAttributes>
  nextButtonAttrs: Readable<HTMLAttributes>
  carousel: Action
  goToSlide: (key: string) => void
  goToPrevSlide: () => void
  goToNextSlide: () => void
  play: () => void
  pause: () => void
  toggle: () => void
}

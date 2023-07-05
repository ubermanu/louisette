import { onBrowserMount } from '$lib/helpers/environment.js'
import { delegateEventListeners } from '$lib/helpers/events.js'
import { traveller } from '$lib/helpers/traveller.js'
import { generateId } from '$lib/helpers/uuid.js'
import { activeElement, documentVisible, reducedMotion } from '$lib/index.js'
import { derived, get, readable, readonly, writable } from 'svelte/store'
import type { Carousel, CarouselConfig } from './carousel.types.js'

export const createCarousel = (config?: CarouselConfig): Carousel => {
  const { orientation, loop, autoplay, interval } = { ...config }

  const current$ = writable<string>('')
  const status$ = writable<'playing' | 'paused'>('paused')
  const orientation$ = writable(orientation || 'horizontal')
  const loop$ = writable(loop || false)
  const autoplay$ = writable(autoplay || false)

  const baseId = generateId()
  const trackId = `${baseId}-track`

  const carouselAttrs = readable({
    role: 'group',
    'aria-roledescription': 'carousel',
    'data-carousel': baseId,
  })

  const trackAttrs = derived(
    [status$, orientation$],
    ([status, orientation]) => ({
      id: trackId,
      'aria-orientation': orientation,
      'aria-live': status === 'playing' ? 'off' : 'polite',
    })
  )

  const slideAttrs = derived([current$, status$], ([current, status]) => {
    return (key: string) => {
      // Set the current slide if it hasn't been set yet
      if (!current) {
        current$.set(key)
      }

      let label = ''

      // If the root node is defined, we can now count the number of slides
      if (carouselNode) {
        const slideKeys = getSlideKeys()
        label = `${slideKeys.indexOf(key) + 1} / ${slideKeys.length}`
      }

      return {
        role: 'group',
        'aria-roledescription': 'slide',
        'aria-current': current === key ? 'slide' : undefined,
        'data-carousel-slide': key,
        'aria-label': label,
        inert: current === key ? undefined : '',
      }
    }
  })

  const previousButtonAttrs = derived([current$, loop$], ([current, loop]) => {
    let disabled = false

    // Set the disabled state of the previous button if the root node is defined
    if (carouselNode && !loop) {
      const slideKeys = getSlideKeys()
      const currentIndex = slideKeys.indexOf(current)
      disabled = currentIndex === 0
    }

    return {
      'aria-controls': trackId,
      'aria-label': 'Go to the previous slide',
      'data-carousel-prev-slide': '',
      disabled,
    }
  })

  const nextButtonAttrs = derived([current$, loop$], ([current, loop]) => {
    let disabled = false

    // Set the disabled state of the next button if the root node is defined
    if (carouselNode && !loop) {
      const slideKeys = getSlideKeys()
      const currentIndex = slideKeys.indexOf(current)
      disabled = currentIndex === slideKeys.length - 1
    }

    return {
      'aria-controls': trackId,
      'aria-label': 'Go to the next slide',
      'data-carousel-next-slide': '',
      disabled,
    }
  })

  const goToSlide = (key: string) => {
    current$.set(key)
  }

  const getSlideKeys = (): string[] => {
    const nodes = traveller(carouselNode!, '[data-carousel-slide]')
    return nodes.all().map((node) => node.dataset.carouselSlide as string)
  }

  const goToPrevSlide = () => {
    const keys = getSlideKeys()

    if (!keys.length) {
      return
    }

    const $loop = get(loop$)
    const $current = get(current$)

    const currentIndex = keys.indexOf($current)
    const prevIndex = currentIndex - 1

    const prevKey =
      $loop && prevIndex < 0 ? keys[keys.length - 1] : keys[prevIndex]

    if (prevKey) {
      current$.set(prevKey)
    }
  }

  const goToNextSlide = () => {
    const keys = getSlideKeys()

    if (!keys.length) {
      return
    }

    const $loop = get(loop$)
    const $current = get(current$)

    const currentIndex = keys.indexOf($current)
    const nextIndex = currentIndex + 1

    const nextKey =
      $loop && nextIndex >= keys.length ? keys[0] : keys[nextIndex]

    if (nextKey) {
      current$.set(nextKey)
    }
  }

  let timer: number | null = null

  const play = () => {
    status$.set('playing')
    timer = window.setInterval(goToNextSlide, interval || 5000)
  }

  const pause = () => {
    status$.set('paused')
    if (timer) {
      window.clearInterval(timer)
      timer = null
    }
  }

  const toggle = () => {
    const $status = get(status$)
    if ($status === 'playing') {
      pause()
    } else {
      play()
    }
  }

  let wasPlaying = false

  const onCarouselMouseEnter = () => {
    if (!wasPlaying) {
      wasPlaying = get(status$) === 'playing'
      pause()
    }
  }

  const onCarouselMouseLeave = () => {
    if (wasPlaying) {
      play()
      wasPlaying = false
    }
  }

  let carouselNode: HTMLElement | null = null

  onBrowserMount(() => {
    carouselNode = document.querySelector<HTMLElement>(
      `[data-carousel="${baseId}"]`
    )

    if (!carouselNode) {
      throw new Error('Could not find the carousel root node')
    }

    if (autoplay) {
      play()
    }

    carouselNode.addEventListener('mouseenter', onCarouselMouseEnter)
    carouselNode.addEventListener('mouseleave', onCarouselMouseLeave)

    const removeListeners = delegateEventListeners(carouselNode, {
      click: {
        '[data-carousel-prev-slide]': () => goToPrevSlide(),
        '[data-carousel-next-slide]': () => goToNextSlide(),
      },
    })

    // Automatically disable autoplay when reduced motion is enabled
    const unsubscribe = reducedMotion.subscribe((reduced) => {
      if (reduced) {
        autoplay$.set(false)
        pause()
      }
    })

    let focusWithin = false

    // Pause the carousel when the user is interacting with it
    // TODO: Use the dedicated action
    const unsubscribe2 = activeElement.subscribe((element) => {
      if (element && carouselNode!.contains(element)) {
        focusWithin = true

        if (get(status$) === 'playing') {
          pause()
          wasPlaying = true
        }
      } else {
        if (focusWithin) {
          focusWithin = false

          if (wasPlaying) {
            play()
            wasPlaying = false
          }
        }
      }
    })

    // Force the carousel to pause when the page is hidden
    const unsubscribe3 = documentVisible.subscribe((visible) => {
      if (!visible && !wasPlaying) {
        if (get(status$) === 'playing') {
          pause()
          wasPlaying = true
        }
      } else if (visible && wasPlaying) {
        play()
        wasPlaying = false
      }
    })

    return () => {
      removeListeners()
      unsubscribe()
      unsubscribe2()
      unsubscribe3()
      pause()
    }
  })

  return {
    current: readonly(current$),
    status: readonly(status$),
    carouselAttrs,
    trackAttrs,
    slideAttrs,
    previousButtonAttrs,
    nextButtonAttrs,
    goToSlide,
    goToPrevSlide,
    goToNextSlide,
    play,
    pause,
    toggle,
  }
}

<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import CarouselSource from './example/Carousel.svelte?raw'
  import SlideSource from './example/Slide.svelte?raw'
  import Snippet from '../../Snippet.svelte'
</script>

<h1>Carousel</h1>

<p>
  The Carousel component allows the user to navigate between a set of pages.
</p>

<p>
  <a
    href="https://www.w3.org/WAI/ARIA/apg/patterns/carousel/"
    target="_blank"
    rel="noopener"
  >
    WAI-ARIA Carousel Pattern
  </a>
</p>

<h2>Example</h2>

<Page />

<h2>Sources</h2>

<p>Page</p>
<Snippet code={PageSource} />

<p>Carousel</p>
<Snippet code={CarouselSource} />

<p>Slide</p>
<Snippet code={SlideSource} />

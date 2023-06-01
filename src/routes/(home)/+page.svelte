<script>
  import logo from '$images/louisette.svg'
  import { base } from '$app/paths'
  import { Highlight } from 'svelte-highlight'
  import bash from 'svelte-highlight/languages/bash'
</script>

<div class="flex h-[60vh] flex-col items-center justify-center">
  <img src={logo} alt class="h-24 w-24 md:h-32 md:w-32" />
  <p class="font-serif text-5xl md:text-6xl">Louisette</p>
  <p class="text-md px-2 text-center opacity-60">
    <b>Louisette</b> is a collection of component primitives for <b>Svelte</b>.
  </p>
  <p class="mt-4">
    <Highlight language={bash} code="npm install louisette" />
  </p>
  <p>
    <a href={`${base}/component/accordion`} class="btn" rel="noopener">
      Get Started
    </a>
  </p>
</div>

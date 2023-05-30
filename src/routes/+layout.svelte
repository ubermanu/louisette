<script>
  import '../app.css'
  import '../highlight.less'
  import Header from './Header.svelte'
  import { page } from '$app/stores'
  import Case from 'case'

  $: subtitle = $page.url.pathname.split('/').filter(Boolean).pop() || ''
  $: subtitle = Case.title(subtitle)
</script>

<svelte:head>
  {#if subtitle.length > 0}
    <title>Louisette | {subtitle}</title>
  {:else}
    <title>Louisette</title>
  {/if}
</svelte:head>

<main
  class="flex min-h-screen w-full flex-col bg-gray-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
>
  <Header />
  <div class="container mx-auto max-w-6xl flex-grow p-4">
    <slot />
  </div>
</main>

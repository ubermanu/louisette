<script lang="ts">
  import { Check, Clipboard } from 'lucide-svelte'
  import { HighlightSvelte } from 'svelte-highlight'

  export let filename: string
  export let code: string

  let copied: boolean = false
  let timeout: number

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code?.replace('$lib', 'louisette'))
    copied = true
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      copied = false
    }, 1000)
  }
</script>

<p class="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
  {filename}
</p>

<div class="relative block overflow-hidden">
  <div class="min-w-full max-w-fit md:whitespace-pre-wrap">
    <HighlightSvelte code={code?.replace('$lib', 'louisette')} />
  </div>
  <button
    on:click={copyToClipboard}
    class="absolute right-2 top-2 rounded p-2 transition-colors duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-800"
    title={copied ? 'Copied!' : 'Copy to clipboard'}
  >
    <svelte:component this={copied ? Check : Clipboard} class="h-5 w-5" />
  </button>
</div>

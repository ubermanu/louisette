<script lang="ts">
  import { documentVisible } from '$lib'
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'

  let elapsed = 0
  let timer: number

  const startTimer = () => {
    timer = setInterval(() => {
      elapsed += 1
    }, 1000)
  }

  const stopTimer = () => {
    clearInterval(timer)
    elapsed = 0
  }

  if (browser) {
    onMount(() =>
      documentVisible.subscribe((visible) => {
        if (visible) {
          startTimer()
        } else {
          stopTimer()
        }
      })
    )
  }
</script>

<p class="mb-4 text-sm opacity-60">
  Try to switch tab, and come back to this one, the timer will be reset.
</p>

<p>You are on this page since <code>{elapsed}s</code></p>

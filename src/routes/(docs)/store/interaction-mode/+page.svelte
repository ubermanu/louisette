<script lang="ts">
  import Page from './example/+page.svelte'
  import PageSource from './example/+page.svelte?raw'
  import Snippet from '../../Snippet.svelte'
</script>

<h1>Interaction mode</h1>

<p>
  The <code>interactionMode</code> store is used to determine whether the user is
  using a mouse or a keyboard.
</p>

<p>
  The interaction mode is updated automatically when the user is interacting
  with the page using a mouse, keyboard, or touch screen.
</p>

<p>
  If the user is typing text into an input, the interaction mode will not be
  updated.
</p>

<h2>Example</h2>

<div>
  <Page />
</div>

<h2>Source</h2>

<Snippet code={PageSource} />

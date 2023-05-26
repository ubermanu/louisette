<script lang="ts">
  import { createLink } from '$lib'
  import { page } from '$app/stores'

  const { link, linkAttrs } = createLink({
    href: $page.url.pathname,
  })
</script>

<!-- svelte-ignore a11y-img-redundant-alt -->
<img
  use:link
  {...$linkAttrs}
  src="https://placekitten.com/200/300"
  alt="An image of a kitten"
  class="w-[10rem] cursor-pointer rounded-sm focus:outline-none focus-visible:ring focus-visible:ring-accent-500 focus-visible:ring-opacity-50"
/>

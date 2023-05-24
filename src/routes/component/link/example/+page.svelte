<script lang="ts">
  import { createLink } from '$lib'
  import { page } from '$app/stores'

  const { link, linkAttrs } = createLink({
    href: $page.url.pathname,
  })
</script>

<img
  use:link
  {...$linkAttrs}
  src="https://placekitten.com/200/300"
  alt="An image of a kitten"
  class="m-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
/>

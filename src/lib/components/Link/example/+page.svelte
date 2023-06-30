<script lang="ts">
  import { createLink } from '$lib'
  import { page } from '$app/stores'

  const { linkAttrs } = createLink({
    href: $page.url.pathname,
  })
</script>

<!-- svelte-ignore a11y-img-redundant-alt -->
<img
  {...$linkAttrs}
  src="https://picsum.photos/seed/1/200/300"
  alt="A clickable image"
  class="w-[10rem] cursor-pointer rounded-sm focus:outline-none focus-visible:ring focus-visible:ring-accent-500 focus-visible:ring-opacity-50"
/>

<script lang="ts">
  import { createLink } from '../link.js'

  const { link, linkAttrs } = createLink({
    href: '#',
  })
</script>

<img
  use:link
  {...$linkAttrs}
  src="https://placekitten.com/200/300"
  alt="kitten"
/>

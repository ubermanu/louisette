<script lang="ts">
  import { createLink } from '$lib'

  const { linkAttrs } = createLink({
    href: '#',
  })
</script>

<img {...$linkAttrs} src="https://placekitten.com/200/300" alt="kitten" />

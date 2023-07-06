<script lang="ts">
  import { createLabel } from '$lib'

  const { labelAttrs, fieldAttrs } = createLabel()
</script>

<div {...$labelAttrs}>Email</div>
<input type="email" {...$fieldAttrs} />

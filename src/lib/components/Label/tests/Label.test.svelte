<script lang="ts">
  import { createLabel } from '$lib'

  const { label, labelAttrs, fieldAttrs } = createLabel()
</script>

<div use:label {...$labelAttrs}>Email</div>
<input type="email" {...$fieldAttrs} />

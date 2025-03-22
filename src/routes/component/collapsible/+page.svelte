<script>
  import { createCollapsible } from '$lib'

  const collapsible = createCollapsible()
</script>

<div class="m-4">
  <button {...collapsible.trigger} class="w-full cursor-pointer p-4 text-left">
    <span
      class="mr-2 inline-block transition-transform"
      class:rotate-90={collapsible.open}>►</span
    >
    The Guillotine’s Democratic Purpose
  </button>
  <div
    {...collapsible.content}
    class="p-4 pt-0"
    class:hidden={!collapsible.open}
  >
    <p>
      The guillotine became the symbol of the French Revolution because it was
      designed to provide an "equal" death. Before the revolution, noblemen were
      often executed by beheading, while commoners suffered more painful deaths
      like hanging or breaking on the wheel. The guillotine ensured that
      everyone—rich or poor—faced the same swift and humane execution.
    </p>
  </div>
</div>

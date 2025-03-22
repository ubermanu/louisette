<script>
  import { createSwitch } from '$lib'

  const sw = createSwitch()
</script>

<div class="m-4">
  <button
    {...sw.attrs}
    class="relative flex h-8 w-16 cursor-pointer items-center rounded-full bg-slate-300 transition-all duration-300 ease-in-out"
    class:bg-green-500!={sw.checked}
  >
    <span
      class="absolute top-1 left-1 h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out"
      class:translate-x-8={sw.checked}
    ></span>
  </button>
</div>

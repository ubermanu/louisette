<script lang="ts">
  import { Bold, Italic, Strikethrough } from 'lucide-svelte'
  import Toolbar from './Toolbar.svelte'
  import Button from './Button.svelte'
</script>

<Toolbar>
  <Button on:click={() => console.log('bold')}>
    <Bold class="h-4 w-4" />
  </Button>
  <Button on:click={() => console.log('italic')}>
    <Italic class="h-4 w-4" />
  </Button>
  <Button on:click={() => console.log('strikethrough')}>
    <Strikethrough class="h-4 w-4" />
  </Button>
</Toolbar>

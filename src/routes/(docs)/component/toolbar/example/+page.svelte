<script lang="ts">
  import {
    Bold,
    Italic,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link,
    Image,
  } from 'lucide-svelte'
  import Toolbar from './Toolbar.svelte'
  import Button from './Button.svelte'
  import Separator from './Separator.svelte'
</script>

<Toolbar>
  <Button>
    <Bold class="h-4 w-4" />
  </Button>
  <Button>
    <Italic class="h-4 w-4" />
  </Button>
  <Button>
    <Strikethrough class="h-4 w-4" />
  </Button>
  <Separator />
  <Button>
    <AlignLeft class="h-4 w-4" />
  </Button>
  <Button>
    <AlignCenter class="h-4 w-4" />
  </Button>
  <Button>
    <AlignRight class="h-4 w-4" />
  </Button>
  <Separator />
  <Button>
    <Link class="h-4 w-4" />
  </Button>
  <Button>
    <Image class="h-4 w-4" />
  </Button>
</Toolbar>

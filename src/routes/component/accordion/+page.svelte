<script>
  import { createAccordion } from '$lib'

  const accordion = createAccordion()

  const castles = [
    {
      title: 'Château de Chambord – A Royal Mystery',
      description:
        'The Château de Chambord, built by King Francis I, has a famous double-helix staircase, believed to be designed by Leonardo da Vinci!',
    },
    {
      title: 'Mont Saint-Michel – A Castle on an Island',
      description:
        'Mont Saint-Michel looks like a fairytale castle but was originally a medieval abbey. During high tide, it becomes nearly inaccessible, making it a natural fortress.',
    },
    {
      title: 'Château de Versailles – More Than a Castle',
      description:
        'Versailles wasn’t just a royal palace—it was a statement of absolute power. The famous Hall of Mirrors was used to showcase France’s wealth and influence.',
    },
    {
      title: 'Carcassonne – A Fortress That Inspired a Game',
      description:
        "The fortified city of Carcassonne is one of the best-preserved medieval castles in Europe. Its towering walls and turrets even inspired the popular board game 'Carcassonne'!",
    },
  ]
</script>

<div class="m-4">
  {#each castles as castle, i}
    <div>
      <button
        {...accordion.trigger(String(i))}
        class="w-full cursor-pointer p-4 text-left"
      >
        <span
          class="mr-2 inline-block transition-transform"
          class:rotate-90={accordion.open === String(i)}>►</span
        >
        {castle.title}
      </button>
      <div
        {...accordion.content(String(i))}
        class="p-4 pt-0"
        class:hidden={accordion.open !== String(i)}
      >
        <p>{castle.description}</p>
      </div>
    </div>
  {/each}
</div>

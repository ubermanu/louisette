<script lang="ts">
  import TagGroup from './TagGroup.svelte'

  let favouriteSports: { label: string; value: string }[] = [
    { label: 'Football', value: '⚽' },
    { label: 'Cricket', value: '🏏' },
    { label: 'Baseball', value: '⚾' },
    { label: 'Basketball', value: '🏀' },
    { label: 'Tennis', value: '🎾' },
    { label: 'Badminton', value: '🏸' },
    { label: 'Table Tennis', value: '🏓' },
    { label: 'Swimming', value: '🏊' },
    { label: 'Boxing', value: '🥊' },
  ]
</script>

<TagGroup label="Favourite sports" bind:options={favouriteSports} />

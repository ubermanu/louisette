<script lang="ts">
  import RadioGroup from './RadioGroup.svelte'
  import Radio from './Radio.svelte'

  let value: string = ''
</script>

<p class="mb-4 text-sm opacity-60">
  You have selected the <b>{value || 'unknown'}</b> power plan.
</p>

<RadioGroup bind:value>
  <Radio value="balanced">
    <h3>⚖️ Balanced</h3>
    <p>
      Provides a balance between performance and energy efficiency by adjusting
      CPU speed and power settings based on system load.
    </p>
  </Radio>
  <Radio value="high-performance">
    <h3>⚡ High Performance</h3>
    <p>
      Prioritizes performance over power savings, keeping the CPU running at
      higher frequencies for faster response times.
    </p>
  </Radio>
  <Radio value="power-saver">
    <h3>🔋 Power Saver</h3>
    <p>
      Maximizes battery life on laptops and mobile devices by reducing CPU
      speed, lowering screen brightness, and applying power-saving measures.
    </p>
  </Radio>
</RadioGroup>

<style lang="postcss">
  h3 {
    @apply font-semibold;
  }

  p {
    @apply mt-1 text-xs;
  }
</style>

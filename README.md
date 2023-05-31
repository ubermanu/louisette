# Louisette

![npm](https://img.shields.io/npm/v/louisette)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/ubermanu/louisette/ci.yml?label=ci)

A collection of headless component primitives for Svelte.

## Installation

```bash
npm install louisette
```

## Usage

```svelte
<script>
  import { createCollapsible } from 'louisette'

  const { trigger, triggerAttrs, contentAttrs } = createCollapsible()
</script>

<div>
  <button use:trigger {...$triggerAttrs}>Toggle</button>
  <div {...$contentAttrs}>
    <p>Content</p>
  </div>
</div>
```

You can check out the [documentation](https://ubermanu.github.io/louisette/) for more examples.

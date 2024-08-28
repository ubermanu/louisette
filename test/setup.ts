import { expect } from 'vitest'

/**
 * Yoinked from https://chialab.github.io/rna/guide/vitest-axe.
 *
 * @param {import('axe-core').AxeResults} results
 * @returns {any}
 */
function toHaveNoViolations(results) {
  const violations = results.violations ?? []

  return {
    pass: violations.length === 0,
    actual: violations,
    message() {
      if (violations.length === 0) {
        return ''
      }

      return `Expected no accessibility violations but received some.

${violations
  .map(
    (violation) => `[${violation.impact}] ${violation.id}
${violation.description}
${violation.helpUrl}
`
  )
  .join('\n')}
`
    },
  }
}

expect.extend({
  toHaveNoViolations,
})

// Skip the canvas error, since it will not be used.
HTMLCanvasElement.prototype.getContext = () => {}

/** Generates a small random HTML id */
export function generateId() {
  return `l-${Math.random().toString(36).substring(2, 12)}`
}

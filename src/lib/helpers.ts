/** Generates a small random uuid */
export function uuid() {
  return `l-${Math.random().toString(36).substring(2, 12)}`
}

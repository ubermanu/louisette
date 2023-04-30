/** Generates a small random uuid */
export function uuid() {
  return Math.random().toString(36).substring(2, 15)
}

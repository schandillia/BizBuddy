export function isCuid(str: string): boolean {
  // CUID pattern: c + timestamp + counter + fingerprint
  const cuidPattern = /^c[a-z0-9]{24}$/
  return cuidPattern.test(str)
}

export function isDefaultKey(str: string): boolean {
  // Check if the string starts with "pk_"
  return !str.startsWith("pk_")
}

// lib/api/api-key.ts
import { randomBytes } from "crypto"

export function generateApiKey() {
  // Generate a random 32-byte hex string
  return `pk_${randomBytes(32).toString("hex")}`
}

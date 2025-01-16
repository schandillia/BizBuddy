// src/lib/api/api-key.ts
import { createPasswordHash } from "@/lib/password-hash"

export async function generateApiKey() {
  // Generate a longer random key for API keys
  const key = new Uint8Array(48)
  crypto.getRandomValues(key)

  // Convert to base64url without using spread operator
  const keyBuffer = key.buffer
  const keyBase64 = btoa(
    new Uint8Array(keyBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")

  const generatedKey = `pk_${keyBase64}`
  const hashedKey = await createPasswordHash(generatedKey)

  return { generatedKey, hashedKey }
}

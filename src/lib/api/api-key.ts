// lib/api/api-key.ts
import { randomBytes } from "crypto"
import bcrypt from "bcrypt"

export async function generateApiKey() {
  // Generate a random 32-byte hex string
  const generatedKey = `pk_${randomBytes(32).toString("hex")}`

  // Hash the generated key using bcrypt
  const saltRounds = 10 // Adjust salt rounds as needed for security/performance trade-off
  const hashedKey = await bcrypt.hash(generatedKey, saltRounds)

  // Return both the generated key and its hashed version
  return { generatedKey, hashedKey }
}

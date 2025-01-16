// src/lib/password-hash.ts
const CURRENT_VERSION = "wc2"
const ITERATIONS = 100000 // Higher is more secure but slower
const SALT_LENGTH = 16 // bytes

function hexToUint8Array(hex: string): Uint8Array {
  return new Uint8Array(
    hex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? []
  )
}

function uint8ArrayToHex(arr: Uint8Array): string {
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

async function pbkdf2(
  password: string,
  salt: Uint8Array,
  iterations: number
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder()
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  )

  return crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: salt,
      iterations: iterations,
    },
    passwordKey,
    256 // 32 bytes
  )
}

export async function createPasswordHash(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
  const hash = await pbkdf2(password, salt, ITERATIONS)
  const hashHex = uint8ArrayToHex(new Uint8Array(hash))
  const saltHex = uint8ArrayToHex(salt)

  return `${CURRENT_VERSION}:${saltHex}:${ITERATIONS}:${hashHex}`
}

export async function verifyPasswordHash(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  // Handle legacy or invalid formats
  if (hashedPassword.startsWith("$2") || !hashedPassword.includes(":")) {
    return false
  }

  const [version, saltHex, iterationsStr, hashHex] = hashedPassword.split(":")

  // Verify version
  if (version !== CURRENT_VERSION && version !== "wc1") {
    return false
  }

  // Handle old wc1 format
  if (version === "wc1") {
    const hashedInput = await createOldWc1Hash(password)
    return timingSafeEqual(hashedInput, hashedPassword)
  }

  // Current version handling
  const salt = hexToUint8Array(saltHex)
  const iterations = parseInt(iterationsStr, 10)
  const hash = await pbkdf2(password, salt, iterations)
  const computedHashHex = uint8ArrayToHex(new Uint8Array(hash))

  return timingSafeEqual(hashHex, computedHashHex)
}

// Keep the old implementation for verifying existing passwords
async function createOldWc1Hash(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return `wc1:${hashHex}`
}

// Your existing timing-safe comparison
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

export function isLegacyHash(hash: string): boolean {
  return hash.startsWith("$2") || hash.startsWith("wc1:")
}

// @/app/actions/auth.ts
"use server"

import { signIn } from "@/auth"
import { signOut } from "@/auth"

// Pass callbackUrl in the correct object format
export async function signInWithGoogle(callbackUrl?: string) {
  await signIn("google", {
    redirectTo: callbackUrl || "/", // Use 'redirectTo' instead of 'callbackUrl'
  })
}

export async function logOut() {
  await signOut()
}

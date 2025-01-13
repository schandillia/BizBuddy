"use server"

import { signIn } from "@/auth"

export async function signInWithGoogle() {
  await signIn("google")
}
// export async function signInWithCredentials() {
//   await signIn("credentials")
// }
